<template>
  <v-container>
    <v-col align="center">
      <v-card width="1200" tile flat>
        <v-card-title class="display-1">게시글 작성</v-card-title>
        <v-divider></v-divider>

        <v-layout>
          <v-col cols="3">
            <v-overflow-btn v-model="category" :items="continent" label="카테고리 선택"></v-overflow-btn>
          </v-col>
        </v-layout>
        <v-layout column="column">
          <v-row justify="center">
            <v-col cols="2">
              <v-subheader>제목</v-subheader>
            </v-col>
            <v-col cols="10">
              <v-text-field v-model="title"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                v-model="files"
                label="File input"
                small-chips
                show-size
                :rules="rules"
                accept="image/png, image/jpeg, .pdf"
                prepend-icon="mdi-camera"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="start">
              <!-- <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25"></v-textarea> -->
              <editor v-model="content" mode="wysiwyg" height="500px" />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-btn
                @click="post"
                :loading="loading"
                class="ml-3"
                color="secondary"
                tile
                outlined
              >작성</v-btn>
              <v-btn @click="rewrite" class="ml-3" color="secondary" tile outlined>재작성</v-btn>
              <v-btn @click="moveToBoard" class="ml-3" color="secondary" tile outlined>취소</v-btn>
            </v-col>
          </v-row>
        </v-layout>
      </v-card>
    </v-col>
  </v-container>
</template>
<script>
import Editor from "@toast-ui/vue-editor/src/Editor.vue";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
export default {
  components: { Editor },
  data() {
    return {
      continent: [
        "Asia",
        "Europe",
        "NorthAmerica",
        "SouthAmerica",
        "Australia",
        "Africa"
      ],
      category: "",
      title: "",
      content: "",
      date: "",
      writer: "A",
      files: [],
      filenames: [],
      numOfComments: 0,
      id: this.$route.params.id,
      month: "",
      hour: "",
      minutes: "",
      num: 1,
      view: 0,
      loading: false,
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "파일 크기가 2 MB 보다 작아야 합니다"
      ]
    };
  },
  created() {
    if (sessionStorage.getItem("items") != null) {
      var itm = JSON.parse(sessionStorage.getItem("items"));
      this.title = itm.title;
      this.content = itm.content;
    }

    this.$firebase
      .firestore()
      .collection("notes")
      .orderBy("num", "desc")
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().num >= 1) {
            this.num = doc.data().num + 1;
          }
        });
      });
  },
  methods: {
    async post() {
      // await this.upload();
      await this.check();
      await this.addDB();
    },
    check() {
      return new Promise((resolve, reject) => {
        if (this.category == "") {
          alert("카테고리를 선택해주세요");
          reject();
        } else if (this.title == "") {
          alert("제목을 입력해주세요");
          reject();
        } else if (this.content == "") {
          alert("내용을 입력해주세요");
          reject();
        } else if (this.files.size > 2000000) {
          alert(this.files.size);
          alert("파일 크기가 2 MB 보다 작아야 합니다");
          reject();
        }
        resolve();
      });
    },
    addDB() {
      return new Promise(resolve => {
        this.$firebase
          .firestore()
          .collection("notes")
          .add({
            title: this.title,
            content: this.content.replace(/\n/gi, "<br/>"),
            date: Date.now(),
            category: this.category,
            filenames: this.files.name == undefined ? "" : this.files.name,
            num: this.num,
            view: this.view,
            writer: localStorage.getItem("email"),
            numOfComments: this.numOfComments
          })
          .then(() => {
            this.uploadToFirebase(this.files);
            this.$router.go(-1);
            resolve();
          });
      });
    },
    async rewrite() {
      this.title = "";
      this.content = "";
      this.category = "";
      this.files = [];
    },
    moveToBoard() {
      this.$router.go(-1);
    },
    // upload() {
    //   return new Promise(resolve => {
    //     for (var i = 0; i < this.files.length; i++) {
    //       console.log(this.files[i]);
    //       var file = this.files[i];
    //       this.filenames.push(this.files[i].name);
    //       this.uploadToFirebase(file);
    //     }
    //     resolve();
    //   });
    // },
    uploadToFirebase(file) {
      if (this.files.name == undefined) {
        return;
      }
      const storageRef = this.$firebase.storage().ref();
      this.loading = true;
      const uploadTask = storageRef
        .child(`board/${this.num}/${file.name}`)
        .put(file);

      uploadTask.on(
        this.$firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case this.$firebase.storage.TaskState.PAUSED: // or 'paused'
              break;
            case this.$firebase.storage.TaskState.RUNNING: // or 'running'
              break;
          }
        },
        error => {
          this.loading = false;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
          });
          this.loading = false;
        }
      );
    }
  }
};
</script>
