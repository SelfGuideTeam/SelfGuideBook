<template>
  <v-container>
    <v-file-input label="File input" v-model="data"></v-file-input>
    <v-btn color="success" :loading="loading" @click="asd()">업로드</v-btn>
    <v-btn color="error" @click="qwe()">다운로드</v-btn>
    <p>{{ downloadURL1 }}</p>
    <a :href="downloadURL2 + '.jpg'" download>{{ downloadURL2 }}</a>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      data: [],
      loading: false,
      downloadURL1: "ㅁ",
      downloadURL2: "ㅁ"
    };
  },
  methods: {
    qwe() {
      const storageRef = firebase.storage().ref();
      // Create a reference to the file we want to download
      var starsRef = storageRef.child(this.data.name);

      // Get the download URL
      starsRef
        .getDownloadURL()
        .then(url => {
          console.log("다운로드" + url);
          this.downloadURL2 = url;
        })
        .catch(function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              break;

            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;

            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    },
    asd() {
      console.log(this.data);
      const storageRef = firebase.storage().ref();
      this.loading = true;

      const uploadTask = storageRef.child(this.data.name).put(this.data);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
          this.loading = false;
        },
        error => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("storage/unauthorized");
              break;

            case "storage/canceled":
              console.log("storage/canceled");
              break;

            case "storage/unknown":
              console.log("storage/unknown");
              break;
          }
          this.loading = false;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log("File available at", downloadURL);
            this.downloadURL1 = downloadURL;
          });
        }
      );
    }
  }
};
</script>
