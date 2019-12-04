<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <v-card tile flat width="1200">
          <v-card-title class="display-1">나의 가이드북</v-card-title>
        </v-card>
        <v-card width="1200" tile flat outlined="true">
          <v-card tile flat>
            <v-card-title>{{ items.title }}</v-card-title>
          </v-card>
          <v-divider></v-divider>
          <v-card tile flat>
            <v-row>
              <v-col cols="12" sm="4" align="center">{{ items.email }}</v-col>
              <v-col cols="12" sm="4" align="center">
                <v-spacer></v-spacer>
                <span>{{ unix(items.date) }}</span>
              </v-col>
              <v-col cols="12" sm="4" align="center">
                <a class="ml-6" @click="fileDownload(items)">
                  {{
                    items.file.length > 20
                      ? items.file.substring(0, 20) + ".."
                      : items.file
                  }}
                </a>
                <v-icon>mdi-download</v-icon>
              </v-col>
            </v-row>
          </v-card>
          <v-divider></v-divider>
          <v-card
            align="start"
            width="1200"
            class="pa-12"
            tile
            flat
            min-height="600"
            v-html="items.content"
          ></v-card>
          <v-toolbar flat color="transparent">
            <v-spacer></v-spacer>
            <v-btn
              class="ml-3"
              color="secondary"
              tile
              outlined
              @click="modifyGuideBook()"
              >수정</v-btn
            >
            <v-btn
              class="ml-3"
              color="secondary"
              tile
              outlined
              @click="GuideBook_Dialog()"
              >삭제</v-btn
            >
            <v-btn
              class="ml-3"
              color="secondary"
              tile
              outlined
              @click="myGuideBookPage()"
              >뒤로</v-btn
            >
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog_GuideBook_Delete" max-width="300">
      <v-card>
        <v-card-title
          class="mb-3"
          style="color: white; backgroundColor: #90CAF9"
          >삭제하시겠습니까?</v-card-title
        >
        <v-card-text>데이터가 삭제되면 복구할 수 없습니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#90CAF9" class="white--text" @click="GuideBook_Delete()"
            >삭제</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      items: {},
      dialog_GuideBook_Delete: false
    };
  },
  mounted() {
    if (localStorage.getItem("email") == null) {
      alert("로그인을 해주세요");
      this.$router.replace("main");
      return;
    }
    if (sessionStorage.getItem("items") == null) {
      this.items = this.$store.getters.getMyGuideBook;
      sessionStorage.setItem("items", JSON.stringify(this.items));
    } else {
      this.items = JSON.parse(sessionStorage.getItem("items"));
    }
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
    GuideBook_Delete() {
      var db = firebase.firestore();
      db.collection("GuideBook")
        .doc(localStorage.getItem("email"))
        .collection("MyGuideBooks")
        .doc(this.items.docid)
        .delete()
        .then(() => {
          this.dialog_GuideBook_Delete = false;
        })
        .then(() => {
          firebase
            .storage()
            .ref()
            .child(this.items.docid)
            .delete();
          this.$router.go(-1);
        });
    },
    GuideBook_Dialog() {
      this.dialog_GuideBook_Delete = true;
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
    myGuideBookPage() {
      this.$router.go(-1);
    },
    modifyGuideBook() {
      this.$router.push("ModifyMyGuideBook");
    }
  }
};
</script>

<style></style>
