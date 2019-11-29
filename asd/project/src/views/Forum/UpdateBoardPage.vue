<template>
  <v-container>
    <v-col align="center">
      <v-card width="1200" tile flat>
        <v-card-title class="display-1">게시글 수정</v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-col cols="3">
            <v-overflow-btn
              v-model="items.category"
              :items="continent"
              label="카테고리 선택"
              >{{ items.category }}</v-overflow-btn
            >
          </v-col>
        </v-layout>
        <v-layout column="column">
          <v-row justify="center">
            <v-col cols="2">
              <v-subheader>제목</v-subheader>
            </v-col>
            <v-col cols="10">
              <v-text-field v-model="items.title">
                {{ items.title }}
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                v-model="files"
                label="File input"
                small-chips
                show-size
                counter
                :rules="rules"
                accept="image/png, image/jpeg, .pdf"
                prepend-icon="mdi-camera"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="start">
              <!-- <v-textarea
            v-model="items.content"
            outlined="outlined"
            no-resize="no-resize"
            rows="25"
            >{{ items.content }}</v-textarea
              >-->
              <editor v-model="items.content" mode="wysiwyg" height="500px" />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="3">
              <v-btn text @click="update">수정</v-btn>
              <v-btn text @click="moveToBoard">취소</v-btn>
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
      items: {
        category: "",
        title: "",
        content: "",
        writer: "",
        date: "",
        filenames: [],
        docid: "",
        view: "",
        num: "",
        loading: false,
        numOfComments: ""
      },
      files: [],
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "파일 크기가 2 MB 보다 작아야 합니다"
      ]
    };
  },
  created() {
    this.create();
  },
  methods: {
    async create() {
      await this.getSession();
      await this.getFile();
    },
    getSession() {
      return new Promise(resolve => {
        this.items = JSON.parse(sessionStorage.getItem("items"));
        console.log(this.items);
        resolve();
      });
    },
    getFile() {
      return new Promise(resolve => {
        if (this.items.filenames == "") {
          return;
        }
        this.$firebase
          .storage()
          .ref()
          .child(`board/${this.items.num}/${this.items.filenames}`)
          .getDownloadURL()
          .then(url => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = event => {
              var blob = xhr.response;
              console.log(blob);
              var file = new File([blob], this.items.filenames, {
                type: blob.type
              });
              this.files = file;
              console.log(this.files);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      });
    },

    async update() {
      this.upload();
      console.log(this.items.docid);
      const r = await this.$firebase
        .firestore()
        .collection("notes")
        .doc(this.items.docid)
        .update({
          title: this.items.title,
          content: this.items.content.replace(/\n/gi, "<br/>"),
          category: this.items.category,
          writer: this.items.writer,
          date: this.items.date,
          filenames: this.files.name == undefined ? "" : this.files.name,
          num: this.items.num,
          view: this.items.view,
          numOfComments: this.items.numOfComments
        });
      console.log(r);
      sessionStorage.setItem("items", JSON.stringify(this.items));
      this.$router.go(-1);
    },
    moveToBoard() {
      this.$router.go(-1);
    },
    upload() {
      if (this.files.name == undefined) return;
      this.uploadToFirebase(this.files);
    },
    uploadToFirebase(file) {
      const storageRef = this.$firebase.storage().ref();
      this.loading = true;
      const uploadTask = storageRef
        .child(`board/${this.items.num}/${this.files.name}`)
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
          console.log(error.code);
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
