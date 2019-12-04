<template>
  <v-container fill-height>
    <v-col cols="12" align="center">
      <v-card tile max-width="1200">
        <v-card-title tile width="1200" class="display-1 pa-5" align="left">가이드북 등록</v-card-title>
        <div align="start" class="title pt-7 px-5">
          <v-text-field v-model="items.title" label="제목" counter="45" id="title" />
        </div>
        <v-text-field v-model="unixDate" label="날짜" readonly v-on="on" class="title px-5"></v-text-field>

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
          <v-btn color="secondary" tile outlined="true" class="mr-4 mb-6" @click="writing()">수정</v-btn>
          <v-btn color="secondary" tile outlined="true" class="mr-4 mb-6" @click="Back()">뒤로</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    unixDate() {
      return this.unix(this.items.date).substr(0, 10);
    }
  },
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
          value.size < 20000000 ||
          "파일 크기가 20 MB 보다 작아야 합니다"
      ]
    };
  },
  created() {
    if (localStorage.getItem("email") == null) {
      alert("로그인 해주세요");
      this.$router.replace("main");
      return;
    }

    this.items = JSON.parse(sessionStorage.getItem("items"));

    var starsRef = firebase
      .storage()
      .ref()
      .child(this.items.docid)
      .getDownloadURL()
      .then(url => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = event => {
          var blob = xhr.response;
          console.log(blob);
          var file = new File([blob], this.items.file, { type: blob.type });
          this.inputFile = file;
          console.log(this.inputFile);
        };
        xhr.open("GET", url);
        xhr.send();
      });
  },
  destroyed() {},
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
    async writing() {
      await this.check();
      await this.write();
    },
    check() {
      return new Promise((resolve, reject) => {
        var title_counter = document.getElementById("title");
        if (title_counter.value.length > 45) {
          console.log(this.inputFile.size);
          alert("제목을 45자 이하로 작성해주세요");
          reject();
        } else if (this.inputFile.size > 20000000) {
          alert("파일 크기가 20 MB 보다 작아야 합니다");
          reject();
        } else {
          resolve();
        }
      });
    },
    write() {
      return new Promise(resolve => {
        if (localStorage.getItem("email") == null) {
          alert("로그인을 해주세요");
          this.$router.replace("main");
          return;
        }
        var db = firebase.firestore();
        // 데이터 입력
        if (
          this.items.title != "" &&
          this.items.content != "" &&
          this.items.date != ""
        ) {
          // 수정하기
          db.collection("GuideBook")
            .doc(localStorage.getItem("email"))
            .collection("MyGuideBooks")
            .doc(this.items.docid)
            .update({
              num: this.items.num,
              email: this.items.email,
              title: this.items.title,
              content: this.items.content.replace(/\n/gi, "<br/>"),
              date: this.items.date,
              file: this.inputFile.name == undefined ? "" : this.inputFile.name
            })
            .then(() => {
              console.log("a" + JSON.stringify(this.items));

              sessionStorage.setItem("items", JSON.stringify(this.items));
              this.$router.go(-1);
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });

          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
