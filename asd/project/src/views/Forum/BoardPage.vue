<template>
  <v-container fill-height fluid>
    <v-col align="center" cols="12">
      <v-card width="1200" flat>
        <v-card-subtitle class="title" align="start">{{
          boardCategory
        }}</v-card-subtitle>
        <v-card-title class="display-1 ">게시판 </v-card-title>
        <v-divider></v-divider>
        <v-toolbar flat color="transparent" class="mt-5">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="검색"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :sort-by="['num']"
          :sort-desc="[true]"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.num }}</td>
              <td @click="moveToRead(item)" style="cursor:pointer" width="400">
                {{ item.title }}
              </td>
              <td>{{ item.writer }}</td>
              <td>{{ unix(item.date) }}</td>
              <td>{{ item.view }}</td>
              <td>{{ item.numOfComments }}</td>
            </tr>
          </template>
        </v-data-table>
        <v-toolbar color="transparent" flat>
          <v-spacer></v-spacer>
          <v-btn
            class="ml-3"
            color="grey darken-1"
            tile
            outlined
            @click="moveToWrite()"
            >작성</v-btn
          >
        </v-toolbar>
      </v-card>
    </v-col>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "번호", value: "num", filterable: false },
        {
          text: "제목",
          align: "left",
          value: "title",
          sortable: false,
          width: 400
        },
        { text: "작성자", value: "writer", filterable: false, sortable: false },
        { text: "날짜", value: "date", filterable: false },
        { text: "조회수", value: "view", filterable: false },
        { text: "댓글", value: "comments", filterable: false }
      ],
      items: [],
      date: "",
      boardCategory: ""
    };
  },
  created() {
    sessionStorage.removeItem("items");
    this.createdAsync();
  },
  destroyed() {},
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
    async createdAsync() {
      await this.boardCategoryCheck();
    },
    boardCategoryCheck() {
      return new Promise((resolve, reject) => {
        if (sessionStorage.getItem("MyBoardPage") != null) {
          this.getMyBoardPage(sessionStorage.getItem("MyBoardPage"));
          resolve();
        } else if (sessionStorage.getItem("category") == null) {
          this.boardCategory = null;
          this.get();
          resolve();
        } else {
          this.boardCategory = sessionStorage.getItem("category");
          this.getUsingCategory(this.boardCategory);
          resolve();
        }
      });
    },
    getUsingCategory(category) {
      this.$firebase
        .firestore()
        .collection("notes")
        .where("category", "==", category)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.items.push({
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
    },
    getMyBoardPage(email) {
      this.$firebase
        .firestore()
        .collection("notes")
        .where("writer", "==", email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.items.push({
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
    },
    async get() {
      const snapshot = await this.$firebase
        .firestore()
        .collection("notes")
        .orderBy("num", "desc")
        .get();
      snapshot.forEach(doc => {
        this.items.push({
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
    },
    moveToRead(item) {
      this.$store.commit("readBoard", item);
      this.$router.push("ReadBoardPage");
    },

    moveToWrite() {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
        return;
      }
      this.$router.push("WriteBoardPage");
    }
  }
};
</script>
