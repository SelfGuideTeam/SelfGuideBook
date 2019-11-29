<template>
  <v-container fill-height>
    <!-- <v-row>
      <v-col cols="12" align="center">
        <v-toolbar width="1200" color="white" class="display-1">나의 가이드북</v-toolbar>
      </v-col>
    </v-row>-->
    <v-col cols="12" align="center">
      <v-card width="1200" flat>
        <v-row>
          <v-col cols="12">
            <v-card-title class="display-1">나의 가이드북</v-card-title>
            <v-divider></v-divider>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                label="검색"
                single-line
                hide-details
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-card-title>
          </v-col>
        </v-row>
        <v-data-table
          :headers="computedHeaders"
          :sort-by="['num']"
          :sort-desc="[true]"
          :search="search"
          :items="items"
          :footer-props="{
    'disable-items-per-page':true
  }"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td v-if="!$vuetify.breakpoint.xsOnly">{{ item.num }}</td>
              <td
                @click="readMyGuideBook(item)"
                width="400"
                class="d-inline-block text-truncate pt-3"
                style="cursor:pointer"
              >
                <a style="color: black">{{ item.title }}</a>
              </td>
              <td v-if="!$vuetify.breakpoint.xsOnly">{{ unix(item.date).substring(0, 10) }}</td>
              <td v-if="!$vuetify.breakpoint.mdAndDown">
                <a @click="fileDownload(item)">{{ item.file }}</a>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-toolbar width="1200" flat color="transparent">
          <v-spacer></v-spacer>
          <v-btn class="ml-3" color="secondary" tile outlined @click="writeMyGuideBook()">글쓰기</v-btn>
          <v-btn class="ml-3" color="secondary" tile outlined @click="back()">뒤로</v-btn>
        </v-toolbar>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    computedHeaders() {
      return this.headers.filter(
        h => !h.hide || !this.$vuetify.breakpoint[h.hide]
      );
    }
  },
  data() {
    return {
      search: "",
      headers: [
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
          width: 400,
          align: "start"
        },
        {
          text: "날짜",
          value: "date",
          sortable: false,
          filterable: false,
          hide: "xsOnly"
        },
        {
          text: "파일",
          value: "file",
          filterable: false,
          hide: "mdAndDown"
        }
      ],
      items: []
    };
  },
  created() {
    sessionStorage.removeItem("items");
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
          this.items.push({
            num: doc.data().num,
            title: doc.data().title,
            content: doc.data().content,
            date: doc.data().date,
            email: doc.data().email,
            file: doc.data().file,
            docid: doc.id
          });
        });
      });
  },
  methods: {
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
    writeMyGuideBook() {
      this.$store.commit("resetMyStore");
      this.$router.push("writeMyGuideBook");
    },
    back() {
      this.$router.go(-1);
    },
    readMyGuideBook(item) {
      this.$store.commit("readMyGuideBook", item);
      this.$router.push("readMyGuideBook");
    }
  }
};
</script>

<style></style>
