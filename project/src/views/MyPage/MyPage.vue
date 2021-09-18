<template>
  <v-container fill-height>
    <v-col cols="12" align="center">
      <v-card width="1200" class="pa-10" outlined tile>
        <v-card-title class="ml-12 headline">
          <v-icon class="pb-2">mdi-account</v-icon>
          <span class="pb-2 font-regular display-1">{{ email }}</span>
          님의 마이페이지
        </v-card-title>

        <v-card width="1000" outlined class="title text-left pa-3 font-weight-bold mt-12">
          작성한 나만의 가이드북
          <v-data-table
            :headers="computedGuideBookHeaders"
            :sort-by="['num']"
            :sort-desc="[true]"
            :items="GuideBookDatas"
            :items-per-page="4"
            class="font-weight-light mt-3"
            scroll-off-screen
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [4,4,4,4]
            }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td v-if="!$vuetify.breakpoint.xsOnly">{{ item.num }}</td>
                <td
                  @click="readMyGuideBook(item)"
                  width="550"
                  class="d-inline-block text-truncate pt-2"
                >
                  <a style="color: black">{{ item.title }}</a>
                </td>
                <td v-if="!$vuetify.breakpoint.smAndDown">{{ unix(item.date).substring(0, 10) }}</td>
                <td v-if="!$vuetify.breakpoint.mdAndDown">
                  <a @click="fileDownload(item)">{{ item.filenames }}</a>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>

        <v-toolbar flat width="1000">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            tile
            outlined="true"
            class="mt-3 ml-3"
            @click="myGuideBookPage()"
          >나의 모든 가이드북 보기</v-btn>
          <v-btn
            color="secondary"
            tile
            outlined="true"
            class="mt-3 ml-3"
            @click="writeMyGuideBook()"
            v-if="!$vuetify.breakpoint.xsOnly"
          >가이드북 등록</v-btn>
        </v-toolbar>

        <v-card width="1000" class="title text-left pa-3 font-weight-bold mt-12" outlined>
          작성한 게시글
          <v-data-table
            :headers="computedBoardHeaders"
            :sort-by="['num']"
            :sort-desc="[true]"
            :items="boardDatas"
            :items-per-page="4"
            class="font-weight-light mt-3"
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [4,4,4,4]
            }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td v-if="!$vuetify.breakpoint.xsOnly">{{ item.num }}</td>
                <td
                  @click="readMyBoard(item)"
                  width="550"
                  class="d-inline-block text-truncate pt-2"
                >
                  <a style="color: black">{{ item.title }}</a>
                </td>
                <td v-if="!$vuetify.breakpoint.smAndDown">{{ unix(item.date / 1000).substr(0, 10) }}</td>
                <td v-if="!$vuetify.breakpoint.mdAndDown">{{ item.view }}</td>
                <td v-if="!$vuetify.breakpoint.lgAndDown">{{ item.numOfComments }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-toolbar flat width="1000">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            tile
            outlined="true"
            class="mt-3 ml-3"
            @click="myBoardPage()"
          >작성한 게시글 모두 보기</v-btn>
        </v-toolbar>

        <v-card width="1000" outlined class="title text-left pa-3 font-weight-bold mt-12">
          작성한 댓글
          <v-data-table
            :headers="computedCommentsHeaders"
            :sort-by="['date']"
            :sort-desc="[true]"
            :items="commentsDatas"
            :items-per-page="4"
            class="font-weight-light mt-3"
            scroll-off-screen
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [4,4,4,4]
            }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td
                  @click="readComment(item)"
                  width="550"
                  class="d-inline-block text-truncate pt-2"
                >
                  <a style="color: black">{{ item.content }}</a>
                </td>
                <td v-if="!$vuetify.breakpoint.smAndDown">{{ unix(item.date / 1000) }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>

        <v-card width="1000" outlined class="title text-left pa-3 font-weight-bold mt-12">
          임시저장한 가이드북
          <v-data-table
            :headers="computedExtensionSavaDataHeaders"
            :sort-by="['date']"
            :sort-desc="[true]"
            :items="extensionSaveData"
            :items-per-page="4"
            class="font-weight-light mt-3"
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [4,4,4,4]
            }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <a @click="writeExtensionSave(item)">{{ item.title }}</a>
                </td>
                <td v-if="!$vuetify.breakpoint.smAndDown">{{ unix(item.date / 1000) }}</td>
                <td>
                  <a @click="ExtensionSavdData_Dialog(item)">
                    <v-icon>mdi-delete</v-icon>
                  </a>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog_ExtensionData_Delete" max-width="300">
      <v-card>
        <v-card-title class="mb-3" style="color: white; backgroundColor: #90CAF9">삭제하시겠습니까?</v-card-title>
        <v-card-text>데이터가 삭제되면 복구할 수 없습니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#90CAF9" class="white--text" @click="ExtensionSaveData_Delete()">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    computedGuideBookHeaders() {
      return this.GuideBookHeaders.filter(
        h => !h.hide || !this.$vuetify.breakpoint[h.hide]
      );
    },
    computedBoardHeaders() {
      return this.boardHeaders.filter(
        h => !h.hide || !this.$vuetify.breakpoint[h.hide]
      );
    },
    computedCommentsHeaders() {
      return this.commentsHeaders.filter(
        h => !h.hide || !this.$vuetify.breakpoint[h.hide]
      );
    },
    computedExtensionSavaDataHeaders() {
      return this.extensionSavaHeaders.filter(
        h => !h.hide || !this.$vuetify.breakpoint[h.hide]
      );
    }
  },
  data() {
    return {
      email: localStorage.getItem("displayName"),
      dialog_ExtensionData_Delete: false,
      GuideBookHeaders: [
        {
          text: "번호",
          value: "num",
          filterable: false,
          hide: "xsOnly"
        },
        {
          text: "제목",
          value: "title",
          sortable: false,
          width: 550
        },
        {
          text: "날짜",
          value: "date",
          sortable: false,
          filterable: false,
          hide: "smAndDown"
        },
        {
          text: "파일",
          value: "file",
          sortable: false,
          filterable: false,
          hide: "mdAndDown"
        }
      ],
      GuideBookDatas: [],
      boardHeaders: [
        {
          text: "번호",
          value: "num",
          filterable: false,
          hide: "xsOnly"
        },
        {
          text: "제목",
          value: "title",
          filterable: false,
          sortable: false,
          width: 550
        },
        {
          text: "날짜",
          value: "date",
          sortable: false,
          filterable: false,
          hide: "smAndDown"
        },
        {
          text: "조회수",
          value: "view",
          filterable: false,
          hide: "mdAndDown"
        },
        {
          text: "댓글수",
          value: "numOfComments",
          filterable: false,
          hide: "lgAndDown"
        }
      ],
      boardDatas: [],
      commentsHeaders: [
        {
          text: "댓글",
          value: "content",
          filterable: false,
          sortable: false,
          width: 550
        },
        {
          text: "날짜",
          value: "date",
          filterable: false,
          hide: "smAndDown"
        }
      ],
      commentsDatas: [],
      extensionSavaHeaders: [
        {
          text: "제목",
          value: "title",
          filterable: false,
          sortable: false
        },
        {
          text: "날짜",
          value: "date",
          filterable: false,
          hide: "smAndDown"
        },
        {
          text: "삭제",
          value: "delete",
          sortable: false,
          filterable: false
        }
      ],
      extensionSaveData: [],
      items: [],
      num: 0,
      title: "",
      content: "",
      date: "",
      writer: "",
      view: 0,
      numOfComments: 0,
      filenames: "",
      category: "",
      docid: ""
    };
  },
  created() {
    sessionStorage.clear();
    if (localStorage.getItem("email") == null) {
      alert("로그인을 해주세요");
      this.$router.replace("main");
      return;
    }
    var db = firebase.firestore();

    db.collection("GuideBook")
      .doc(localStorage.getItem("email"))
      .collection("MyGuideBooks")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.GuideBookDatas.push({
            num: doc.data().num,
            title: doc.data().title,
            content: doc.data().content,
            date: doc.data().date,
            writer: doc.data().writer,
            filenames: doc.data().filenames,
            docid: doc.id
          });
        });
      });

    db.collection("notes")
      .where("writer", "==", localStorage.getItem("email"))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.boardDatas.push({
            num: doc.data().num,
            title: doc.data().title,
            content: doc.data().content,
            date: doc.data().date,
            writer: doc.data().writer,
            view: doc.data().view,
            numOfComments: doc.data().numOfComments,
            filenames: doc.data().filenames,
            category: doc.data().category,
            docid: doc.id
          });
        });
      });

    db.collectionGroup("comments")
      .where("writer", "==", localStorage.getItem("email"))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.commentsDatas.push({
            content: doc.data().content,
            date: doc.data().date,
            writer: doc.data().writer,
            docid: doc.data().docid
          });
        });
      });

    db.collection("BOARD_GUIDEBOOK")
      .doc(localStorage.getItem("email"))
      .collection("GUIDEBOOKS")
      .orderBy("created_date")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.extensionSaveData.push({
            num: 0,
            title: doc.id,
            content: doc.data().html,
            date: doc.data().modifiyed_date,
            writer: localStorage.getItem("email"),
            view: 0,
            numOfComments: 0,
            filenames: "",
            category: "",
            docid: doc.id
          });
        });
      });
  },
  methods: {
    readComment(aa) {
      this.commentDB(aa);
    },
    commentDB(aa) {
      var db = firebase.firestore();
      console.log(JSON.stringify(aa));
      db.collection("notes")
        .doc(aa.docid)
        .get()
        .then(docs => {
          (this.items.num = docs.data().num),
            (this.items.title = docs.data().title),
            (this.items.content = docs.data().content),
            (this.items.writer = docs.data().writer),
            (this.items.date = docs.data().date),
            (this.items.view = docs.data().view),
            (this.items.numOfComments = docs.data().numOfComments),
            (this.items.filenames = docs.data().filenames),
            (this.items.category = docs.data().category),
            (this.items.docid = docs.id);
        })
        .then(() => {
          console.log(this.items);
          this.$store.commit("readBoard", this.items);
          this.$router.push("ReadBoardPage");
        });
    },
    unix(time) {
      var date = new Date(time * 1000);
      var year = date.getFullYear();
      var month = "0" + (date.getMonth() + 1);
      var day = "0" + date.getDate();
      var hour = "0" + date.getHours();
      var minute = "0" + date.getMinutes();
      var second = "0" + date.getSeconds();
      return (
        year +
        "-" +
        month.substr(-2) +
        "-" +
        day.substr(-2) +
        " " +
        hour.substr(-2) +
        ":" +
        minute.substr(-2) +
        ":" +
        second.substr(-2)
      );
    },
    writeExtensionSave(go) {
      sessionStorage.setItem("items", JSON.stringify(go));
      this.$router.push("WriteBoardPage");
    },
    ExtensionSavdData_Dialog(item) {
      this.dialog_ExtensionData_Delete = true;
      this.$store.commit("deleteData", item);
    },
    ExtensionSaveData_Delete() {
      var db = firebase.firestore();
      var item = this.$store.getters.getDeleteData;
      db.collection("BOARD_GUIDEBOOK")
        .doc(localStorage.getItem("email"))
        .collection("GUIDEBOOKS")
        .doc(item.title)
        .delete()
        .then(() => {
          this.dialog_ExtensionData_Delete = false;
          const index = this.extensionSaveData.indexOf(item);
          this.extensionSaveData.splice(index, 1);
        });
    },
    writeMyGuideBook() {
      this.$store.commit("resetMyStore");
      this.$router.push("writeMyGuideBook");
    },
    myGuideBookPage() {
      this.$router.push("myGuideBookPage");
    },
    myBoardPage() {
      sessionStorage.setItem("MyBoardPage", localStorage.getItem("email"));
      this.$router.push("BoardPage");
    },
    myComments() {
      this.$router.push("ReadBoardPage");
    },
    writeBoardPage() {
      this.$router.push("WriteBoardPage");
    },
    fileDownload(item) {
      const storageRef = firebase.storage().ref();
      var starsRef = storageRef.child(item.docid);
      starsRef
        .getDownloadURL()
        .then(url => {
          var aTag = document.createElement("a");
          aTag.download = url;
          aTag.href = url;
          aTag.click();
        })
        .catch(function(error) {
          switch (error.code) {
            case "storage/object-not-found":
              break;
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
          }
        });
    },
    readMyGuideBook(item) {
      console.log(item);
      this.$store.commit("readMyGuideBook", item);
      this.$router.push("readMyGuideBook");
    },
    readMyBoard(item) {
      this.$store.commit("readBoard", item);
      this.$router.push("ReadBoardPage");
    }
  }
};
</script>

<style></style>
