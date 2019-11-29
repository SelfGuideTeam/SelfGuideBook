<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="comments"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.writer }}</td>
          <td>{{ item.content }}</td>
          <td>{{ unix(item.date) }}</td>
          <td>
            <v-icon
              text
              color="grey"
              v-model="item.id"
              @click="getSelectedComment(val, item.id)"
              v-show="isLogin(item)"
              >mdi-comment-edit</v-icon
            >
          </td>
          <td>
            <v-icon
              text
              color="grey"
              v-model="item.id"
              v-show="isLogin(item)"
              @click="deleteComment(val, item.id)"
              >mdi-trash-can-outline</v-icon
            >
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-layout>
      <v-row wrap offset="1">
        <v-col cols="11">
          <v-textarea
            v-model="content"
            solo
            rows="3"
            no-resize="no-resize"
            elevation="14"
            >{{ content }}</v-textarea
          >
        </v-col>
        <v-col cols="1" class="mt-5">
          <v-btn
            color="grey darken-1"
            tile
            outlined="true"
            @click="addComment(val)"
            >작성</v-btn
          >
        </v-col>
      </v-row>
    </v-layout>
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog1" persistent max-width="400">
          <rewrite-comment :val="rewrite" v-on:sendDialog1="receiveDialog1" />
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog2" persistent max-width="400">
          <delete-comment :val="del" v-on:sendDialog2="receiveDialog2" />
        </v-dialog>
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import rewriteComment from "../Forum/rewriteComment";
import deleteComment from "../Forum/deleteComment";
export default {
  props: { val: String },
  components: { rewriteComment, deleteComment },

  data() {
    return {
      headers: [
        {
          text: "댓글",
          value: "writer",
          sortable: false,
          filterable: false
        },
        {
          value: "content",
          sortable: false,
          filterable: false,
          width: "500px"
        },
        {
          value: "date",
          sortable: false,
          filterable: false
        },
        {
          value: "update",
          sortable: false,
          filterable: false
        },
        {
          value: "delete",
          sortable: false,
          filterable: false
        }
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
      return localStorage.getItem("email") == itm.writer;
    },
    async addComment(id) {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
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
      this.getComments(id);
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
    },
    // 댓글 가져오기
    async getSelectedComment(id1, id2) {
      this.rewrite.id2 = id2;
      this.dialog1 = true;
    },
    async deleteComment(id1, id2) {
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
            this.$firebase
              .firestore()
              .collection("notes")
              .doc(id)
              .update({ numOfComments: this.numOfComments });
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
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
