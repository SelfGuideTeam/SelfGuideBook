<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <v-card width="1200" flat>
          <v-card-title class="display-1">게시글 읽기</v-card-title>
          <v-divider></v-divider>
          <v-card class="mt-5" width="1200" tile outlined>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  {{
                  items.category
                  }}
                </v-list-item-subtitle>
                <v-list-item-title class="headline mt-5">
                  {{
                  items.title
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-row class="mt-7">
                    <v-col cols="6" sm="4" md="4" lg="4" xl="4">{{ unix(items.date) }}</v-col>
                    <v-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <v-icon class="mr-2">mdi-account</v-icon>
                      {{ items.writer }}
                    </v-col>
                    <v-spacer v-if="!$vuetify.breakpoint.xsOnly"></v-spacer>
                    <v-col cols="6" sm="2" md="2" lg="2" xl="2">
                      <v-icon class="mr-2">mdi-eye-outline</v-icon>
                      {{ items.view }}
                    </v-col>
                    <v-col cols="6" sm="2" md="2" lg="2" xl="2">
                      <v-icon class="mr-2">mdi-comment-outline</v-icon>
                      {{ computedNumofComments }}
                    </v-col>
                  </v-row>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item-content>
              <v-row>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-col>
                  <a class="caption" @click="downloadFiles">
                    {{
                    items.filenames
                    }}
                  </a>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-divider />
            <v-row>
              <v-col align="start">
                <!-- <v-card-text v-html="items.content"></v-card-text> -->
                <viewer v-model="items.content" mode="wysiwyg" class="px-4" />
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey darken-1"
                tile
                outlined="true"
                @click="moveToUpdate(items.docid)"
                v-show="isLogin"
              >수정</v-btn>
              <v-btn
                color="grey darken-1"
                tile
                outlined="true"
                @click="dialog_Delete"
                v-show="isLogin"
              >삭제</v-btn>
              <v-btn color="grey darken-1" tile outlined="true" @click="moveToBoard()">뒤로</v-btn>
            </v-card-actions>
          </v-card>
          <span>
            <comments :val="items.docid"></comments>
          </span>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog_Board_Delete" max-width="300">
      <v-card>
        <v-card-title class="mb-3" style="color: white; backgroundColor: #90CAF9">삭제하시겠습니까?</v-card-title>
        <v-card-text>데이터가 삭제되면 복구할 수 없습니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#90CAF9" class="white--text" @click="del(items.docid)">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { Editor, Viewer } from "@toast-ui/vue-editor";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
import comments from "./comment";
export default {
  computed: {
    isLogin() {
      return (
        localStorage.getItem("email") == this.items.writer ||
        localStorage.getItem("manager") == 1
      );
    },
    computedNumofComments() {
      return this.$store.getters.getNumOfComments;
    }
  },
  components: { comments, Viewer },
  data() {
    return {
      dialog_Board_Delete: false,
      items: {
        docid: "",
        title: "",
        content: "",
        writer: "",
        category: "",
        date: "",
        view: 0,
        num: "",
        filenames: [],
        numOfComments: 0
      }
    };
  },
  created() {
    this.create();
  },
  methods: {
    unix(time) {
      var d = new Date(time);
      var year = d.getFullYear();
      var month = "0" + (d.getMonth() + 1);
      var day = "0" + d.getDate();
      var hour = "0" + d.getHours();
      var minute = "0" + d.getMinutes();
      return (
        year +
        "." +
        month.substr(-2) +
        "." +
        day.substr(-2) +
        " " +
        hour.substr(-2) +
        ":" +
        minute.substr(-2)
      );
    },
    dialog_Delete() {
      this.dialog_Board_Delete = true;
    },
    async create() {
      await this.setting();
      await this.viewUp();
    },

    setting() {
      return new Promise(resolve => {
        if (sessionStorage.getItem("items") != null) {
          this.items = JSON.parse(sessionStorage.getItem("items"));
          resolve();
        } else {
          this.items = this.$store.getters.getBoard;
          sessionStorage.setItem("items", JSON.stringify(this.items));
          resolve();
        }
      });
    },
    viewUp() {
      return new Promise(resolve => {
        // view +1
        this.$store.commit("numOfCommentsChange", this.items.numOfComments);
        this.items.view += 1;
        // view 업데이트
        this.$firebase
          .firestore()
          .collection("notes")
          .doc(this.items.docid)
          .update({ view: this.items.view });
      });
    },

    moveToBoard() {
      sessionStorage.removeItem("items");
      this.$router.go(-1);
    },
    moveToUpdate(id) {
      this.$router.push("UpdateBoardPage");
    },
    del(id) {
      this.$firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .delete()
        .then(() => {
          this.$firebase
            .storage()
            .ref()
            .child(`board/${this.items.num}/${this.items.filenames}`)
            .delete();
          console.log("성공");
          this.dialog_Board_Delete = false;
          sessionStorage.removeItem("items");
          this.$router.go(-1);
        });
    },
    downloadFiles() {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
        return;
      }
      const storageRef = this.$firebase.storage().ref();
      var starsRef = storageRef.child(
        `board/${this.items.num}/${this.items.filenames}`
      );
      starsRef
        .getDownloadURL()
        .then(url => {
          console.log(url);
          let link = document.createElement("a");
          link.href = url;
          link.download = url;
          link.click();
        })
        .catch(error => {
          console.log(error.code);
        });
    }
  }
};
</script>
