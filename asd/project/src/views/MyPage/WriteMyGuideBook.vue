<template>
  <v-container fill-height>
    <v-col cols="12" align="center">
      <v-card tile max-width="1200">
        <v-card-title tile width="1200" class="display-1 pa-5" align="left">가이드북 등록</v-card-title>
        <div align="start" class="title pt-7 px-5">
          <v-text-field v-model="items.title" label="제목" counter="45" id="title" />
        </div>
        <v-text-field v-model="items.date" label="날짜" readonly v-on="on" class="title px-5"></v-text-field>

        <v-file-input
          class="title px-5"
          label="파일"
          v-model="inputFile"
          :rules="rules"
          show-size
          small-chips
          accept="image/png, image/jpeg, .pdf"
        ></v-file-input>
        <div align="start" class="title px-5">
          <v-textarea v-model="items.content" label="내용" outlined="true" rows="20" />
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" tile outlined="true" class="mr-4 mb-6" @click="writing()">작성</v-btn>
          <v-btn color="secondary" tile outlined="true" class="mr-4 mb-6" @click="Back()">뒤로</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      items: {
        num: "",
        email: "",
        title: "",
        content: "",
        date: "",
        file: "",
        docid: ""
      },
      num: 1,
      isEmptyCheck: true,
      inputFile: [],
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "파일 크기가 2 MB 보다 작아야 합니다"
      ]
    };
  },
  created() {
    if (localStorage.getItem("email") == null) {
      alert("로그인을 해주세요");
      this.$router.replace("main");
      return;
    }
    this.$store.commit("resetMyStore");
    this.items = this.$store.getters.getMyGuideBook;
  },
  destroyed() {
    sessionStorage.removeItem("items");
  },

  methods: {
    async writing() {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
        this.$router.replace("main");
        return;
      }
      await this.check();
      await this.topNum();
      await this.write();
    },
    check() {
      return new Promise((resolve, reject) => {
        var title_counter = document.getElementById("title");
        if (title_counter.value.length > 45) {
          console.log(this.inputFile.size);
          alert("제목을 45자 이하로 작성해주세요");
          reject();
        } else if (this.inputFile.size > 2000000) {
          alert("파일 크기가 2 MB 보다 작아야 합니다");
          reject();
        } else {
          resolve();
        }
      });
    },

    topNum() {
      return new Promise(resolve => {
        var db = firebase.firestore();
        db.collection("GuideBook")
          .doc(localStorage.getItem("email"))
          .collection("MyGuideBooks")
          .orderBy("num", "desc")
          .limit(1)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.data().num >= 1) {
                this.num = doc.data().num + 1;
                this.isEmptyCheck = false;
                resolve();
              }
            });
          })
          .then(() => {
            resolve();
          });
      });
    },

    write() {
      return new Promise(resolve => {
        var db = firebase.firestore();
        if (
          // 내용 가득 채워져 있음
          this.items.title != "" &&
          this.items.content != "" &&
          this.items.date != ""
        ) {
          //입력
          db.collection("GuideBook")
            .doc(localStorage.getItem("email"))
            .collection("MyGuideBooks")
            .add({
              num: this.num,
              email: localStorage.getItem("email"),
              title: this.items.title,
              content: this.items.content.replace(/\n/gi, "<br/>"),
              date: Math.floor(new Date().getTime() / 1000),
              file: this.inputFile.name == undefined ? "" : this.inputFile.name
            })
            .then(docRef => {
              this.fileSave(docRef.id);
              this.$router.go(-1);
              resolve();
            })
            .catch(function(error) {
              alert("Error adding document: ", error);
              resolve();
            });
        } else {
          if (this.items.title == "") {
            alert("제목을 입력해주세요");
          } else if (this.items.content == "") {
            alert("내용을 입력해주세요");
          } else if (this.items.date == "") {
            alert("날짜를 선택해주세요");
          }
        }
      });
    },
    Back() {
      this.$router.go(-1);
    },
    fileSave(docId) {
      //파일저장
      if (this.inputFile.name != undefined) {
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(docId).put(this.inputFile);

        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                break;
              case firebase.storage.TaskState.RUNNING:
                break;
            }
          },
          error => {
            switch (error.code) {
              case "storage/unauthorized":
                break;
              case "storage/canceled":
                break;
              case "storage/unknown":
                break;
            }
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log("File available at", downloadURL);
            });
          }
        );
      }
    }
  }
};
</script>

<style></style>
