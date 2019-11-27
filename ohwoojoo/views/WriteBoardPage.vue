<template>
<v-app>
    <v-container>
      <v-layout>
        <h1>게시글 작성</h1>
      </v-layout>
      <v-layout>
          <v-col cols="3" offset="1">
            <v-overflow-btn
              v-model="category"
              :items="continent"
              label="카테고리 선택"
            ></v-overflow-btn>
          </v-col>
      </v-layout>
        <v-layout column="column">
            <v-row justify="center">
                <v-col cols="2">
                    <v-subheader>제목</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="title"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="10" offset="1">
                  <v-file-input
                    v-model="files"
                    label="File input"
                    multiple
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
                <v-col cols="10" offset="1">
                    <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25"></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="4">
                    <v-btn text @click="post" :loading="loading">작성</v-btn>
                    <v-btn text @click="rewrite">재작성</v-btn>
                    <v-btn text @click="moveToBoard">취소</v-btn>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</v-app>
</template>
<script>
export default {
  data () {
    return {
      continent: ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
      category: '',
      title: '',
      content: '',
      date: '',
      writer: 'A',
      files: [],
      filenames: [],
      numOfComments: 0,
      id: this.$route.params.id,
      month: '',
      hour: '',
      minutes: '',
      num: 1,
      view: 0,
      loading: false,
      rules: [
        value => !value || value.size < 10000000 || 'Avatar size should be less than 10 MB!'
      ]
    }
  },
  created () {
    this.$firebase.firestore().collection('notes')
      .orderBy('num', 'desc')
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().num >= 1) {
            this.num = doc.data().num + 1
          }
        })
      })
  },
  methods: {
    async post () {
      this.upload()
      // const d = new Date()
      // this.month = d.getMonth() + 1
      // if (d.getHours() < 10) {
      //   this.hour = '0' + d.getHours()
      // } else {
      //   this.hour = d.getHours()
      // }
      // if (d.getMinutes() < 10) {
      //   this.minutes = '0' + d.getMinutes()
      // } else {
      //   this.minutes = d.getMinutes()
      // }
      // const date = d.getFullYear() + '.' + this.month + '.' + d.getDate() + ' ' + this.hour + ':' + this.minutes

      const r = await this.$firebase.firestore().collection('notes').add({
        title: this.title,
        content: this.content,
        date: Date.now(),
        category: this.category,
        filenames: this.filenames,
        num: this.num,
        view: this.view,
        writer: this.writer,
        numOfComments: this.numOfComments
      })
      console.log(r)
      this.$router.push('board-page')
      console.log('성공')
    },
    async rewrite () {
      this.title = ''
      this.content = ''
      this.category = ''
      this.files = []
    },
    moveToBoard () {
      this.$router.push('board-page')
    },
    upload () {
      for (var i = 0; i < this.files.length; i++) {
        console.log(this.files[i])
        var file = this.files[i]
        this.filenames.push(this.files[i].name)
        this.uploadToFirebase(file)
      }
    },
    uploadToFirebase (file) {
      const storageRef = this.$firebase.storage().ref()
      this.loading = true
      const uploadTask = storageRef.child(`board/${this.num}/${file.name}`).put(file)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(this.$firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case this.$firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused')
              break
            case this.$firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running')
              break
          }
        }, (error) => {
          console.log(error.code)
          this.loading = false
        }, () => {
        // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL)
          })
          this.loading = false
        })
    }
  }
}
</script>
