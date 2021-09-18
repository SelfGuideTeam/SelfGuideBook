<template>
  <v-container fluid>
    <v-card width="1200" tile flat color="transparent">
      <v-data-table :headers="headers" :items="comments" :items-per-page="10" class="elevation-1">
        <template v-slot:item="{ item }">
          <tr>
            <td width="1200">
              <v-row>
                <v-col cols="12">{{ item.writer }}</v-col>
                <v-col cols="12">
                  <v-card
                    flat
                    tile
                    scrollable
                    color="transparent"
                    width="100%"
                    max-width="350"
                    v-if="$vuetify.breakpoint.xsOnly"
                  >{{ item.content }}</v-card>
                  <v-card
                    flat
                    tile
                    scrollable
                    color="transparent"
                    width="100%"
                    max-width="500"
                    v-if="$vuetify.breakpoint.smOnly"
                  >{{ item.content }}</v-card>
                  <v-card
                    flat
                    tile
                    scrollable
                    color="transparent"
                    width="100%"
                    max-width="800"
                    v-if="$vuetify.breakpoint.mdOnly"
                  >{{ item.content }}</v-card>
                  <v-card
                    flat
                    tile
                    scrollable
                    color="transparent"
                    width="100%"
                    max-width="1100"
                    v-if="$vuetify.breakpoint.lgAndUp"
                  >{{ item.content }}</v-card>
                </v-col>
                <v-col cols="9" sm="10" md="11" align="end">{{ unix(item.date) }}</v-col>
                <v-col cols="3" sm="2" md="1" align="end">
                  <v-icon
                    text
                    color="grey"
                    v-model="item.id"
                    @click="getSelectedComment(item.content, item.id)"
                    v-show="isLogin(item)"
                  >mdi-comment-edit</v-icon>
                  <v-icon
                    text
                    color="grey"
                    v-model="item.id"
                    v-show="isLogin(item)"
                    @click="deleteCommentDialog(item.id)"
                  >mdi-trash-can-outline</v-icon>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-layout>
      <v-row wrap offset="1">
        <v-col cols="11">
          <v-textarea
            v-model="content"
            solo
            rows="3"
            no-resize="no-resize"
            elevation="14"
          >{{ content }}</v-textarea>
        </v-col>
        <v-col cols="1" class="mt-5">
          <v-btn color="grey darken-1" tile outlined="true" @click="addComment(val)">작성</v-btn>
        </v-col>
      </v-row>
    </v-layout>
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog1" max-width="400">
          <v-card>
            <v-card-text class="pt-5">
              <v-textarea v-model="rewriteContent" solo rows="3" no-resize>
                {{
                rewriteContent
                }}
              </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog1 = !dialog1">취소</v-btn>
              <v-btn color="blue darken-1" text @click="rewriteComment(rewriteContent)">수정</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog2" max-width="400">
          <v-card>
            <v-card-title class="mb-3" style="color: white; backgroundColor: #90CAF9">삭제하시겠습니까?</v-card-title>
            <v-card-text>데이터가 삭제되면 복구할 수 없습니다.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#90CAF9" class="white--text" @click="deleteComment">삭제</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import { Editor, Viewer } from "@toast-ui/vue-editor";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
export default {
  props: { val: String },

  data() {
    return {
      headers: [
        {
          text: "댓글",
          value: "writer",
          sortable: false,
          filterable: false
        }
        // {
        //   value: "content",
        //   sortable: false,
        //   filterable: false
        // },
        // {
        //   value: "date",
        //   sortable: false,
        //   filterable: false
        // },
        // {
        //   value: "update",
        //   sortable: false,
        //   filterable: false
        // },
        // {
        //   value: "delete",
        //   sortable: false,
        //   filterable: false
        // }
      ],
      content: "",
      comments: [],
      writer: localStorage.getItem("email"),
      rewriteContent: "",
      rewriteWriter: "",
      date: "",
      // 게시글 필드
      notesTitle: "",
      notesContent: "",
      notesWriter: "",
      notesCategory: "",
      notesDate: "",
      filenames: [],
      num: "",
      view: 0,
      numOfComments: 0,
      // dialog
      dialog1: false,
      dialog2: false,
      rewrite: {
        id1: this.val,
        id2: ""
      },
      del: {
        id1: this.val,
        id2: ""
      }
    };
  },
  mounted() {
    this.getComments(this.val);
  },
  methods: {
    cancelDeleteComment() {
      this.dialog2 = false;
    },
    async getSelectedComment(content, id2) {
      this.rewriteContent = content;
      this.rewrite.id2 = id2;
      this.dialog1 = true;
    },
    rewriteComment() {
      if (this.rewriteContent.replace(/ /gi, "") == "") {
        alert("내용을 입력해주세요");
        return;
      }
      this.$firebase
        .firestore()
        .collection("notes")
        .doc(JSON.parse(sessionStorage.getItem("items")).docid)
        .collection("comments")
        .doc(this.rewrite.id2)
        .update({
          content: this.rewriteContent
          //   writer: this.rewriteWriter,
          //   date: this.date
        })
        .then(() => {
          this.getComments(JSON.parse(sessionStorage.getItem("items")).docid);
          this.dialog1 = false;
        });
    },
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
    isLogin(itm) {
      return (
        localStorage.getItem("email") == itm.writer ||
        localStorage.getItem("manager") == 1
      );
    },
    async addComment(id) {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
        return;
      }
      if (this.content.replace(/ /gi, "") == "") {
        alert("내용을 입력해주세요");
        return;
      }

      this.comments = [];
      await this.$firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .collection("comments")
        .add({
          writer: this.writer,
          content: this.content,
          date: Date.now(),
          docid: id
        });
      // 게시글 컬렉션에 댓글 수 +1
      this.plusComments(id);
      this.content = "";
    },
    async getComments(id) {
      const snapshot = await this.$firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .collection("comments")
        .orderBy("date", "asc")
        .get();
      this.comments = [];
      snapshot.forEach(doc => {
        const { writer, content } = doc.data();
        console.log(doc.id, "=>", doc.data());
        this.comments.push({
          writer,
          content,
          date: doc.data().date,
          id: doc.id
        });
      });
      console.log(snapshot);
      this.$firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .get()
        .then(doc => {
          this.numOfComments = doc.data().numOfComments;
        });
    },
    // 댓글 가져오기

    async deleteComment(id2) {
      await this.$firebase
        .firestore()
        .collection("notes")
        .doc(JSON.parse(sessionStorage.getItem("items")).docid)
        .collection("comments")
        .doc(this.del.id2)
        .delete()
        .then(() => {
          this.dialog2 = false;
          this.numOfComments -= 1;
          this.$store.commit("numOfCommentsChange", this.numOfComments);
          this.$firebase
            .firestore()
            .collection("notes")
            .doc(JSON.parse(sessionStorage.getItem("items")).docid)
            .update({
              numOfComments: this.numOfComments
            })
            .then(() => {
              this.getComments(
                JSON.parse(sessionStorage.getItem("items")).docid
              );
              //   this.minusComments(
              //     JSON.parse(sessionStorage.getItem("items")).docid
              //   );
            });
        });
    },
    async deleteCommentDialog(id2) {
      this.del.id2 = id2;
      this.dialog2 = true;
    },
    // 댓글 수 +1
    async plusComments(id) {
      // 게시글 가져오기
      await this.$firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            console.log("Document data:", doc.data());
            this.notesTitle = doc.data().title;
            this.notesDate = doc.data().date;
            this.notesContent = doc.data().content;
            this.notesWriter = doc.data().writer;
            this.notesCategory = doc.data().category;
            this.num = doc.data().num;
            this.view = doc.data().view;
            this.filenames = doc.data().filenames;
            this.numOfComments = doc.data().numOfComments;
            // 댓글 수 +1
            this.numOfComments += 1;
            // 게시글 도큐먼트 수정
            this.$store.commit("numOfCommentsChange", this.numOfComments);
            this.$firebase
              .firestore()
              .collection("notes")
              .doc(id)
              .update({ numOfComments: this.numOfComments });
          }
        })
        .then(() => {
          this.getComments(JSON.parse(sessionStorage.getItem("items")).docid);
        });
    },
    receiveDialog1(msg) {
      this.dialog1 = msg;
      this.getComments(this.val);
    },
    receiveDialog2(msg) {
      this.dialog2 = msg;
      this.getComments(this.val);
    }
  }
};
</script>
