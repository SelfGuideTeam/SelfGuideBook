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
            >{{category}}</v-overflow-btn>
          </v-col>
      </v-layout>
        <v-layout column="column">
            <v-row justify="center">
                <v-col cols="2">
                    <v-subheader>제목</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="title">{{title}}</v-text-field>
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
                    <!-- <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25">{{content}}</v-textarea> -->
                    <editor v-model="content" height="500px"/>
                </v-col>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="3">
                    <v-btn text @click="update(id)">수정</v-btn>
                    <v-btn text @click="moveToReadBoard">취소</v-btn>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</v-app>
</template>
<script>
import Editor from '@toast-ui/vue-editor/src/Editor.vue'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'

export default {
  components: { Editor },
  data () {
    return {
      continent: ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
      category: '',
      title: '',
      content: '',
      writer: '',
      date: '',
      files: [],
      filenames: [],
      id: this.$route.params.id,
      view: '',
      num: '',
      loading: false,
      numOfComments: '',
      rules: [
        value => !value || value.size < 10000000 || 'Avatar size should be less than 10 MB!'
      ]
    }
  },
  created () {
    this
      .$firebase
      .firestore()
      .collection('notes')
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!')
        } else {
          console.log('Document data:', doc.data())
          this.title = doc.data().title
          this.date = doc.data().date
          this.content = doc.data().content
          this.writer = doc.data().writer
          this.category = doc.data().category
          this.num = doc.data().num
          this.view = doc.data().view
          this.filenames = doc.data().filenames
          this.numOfComments = doc.data().numOfComments
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    async update (id) {
      this.upload()
      const r = await this.$firebase.firestore().collection('notes').doc(id).set({
        title: this.title,
        content: this.content,
        category: this.category,
        writer: this.writer,
        date: this.date,
        filenames: this.filenames,
        num: this.num,
        view: this.view,
        numOfComments: this.numOfComments
      })
      console.log(r)
      this.$router.push({ name: 'Board' })
    },
    moveToReadBoard () {
      this.$router.go(-1)
    },
    upload () {
      this.filenames = []
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
      const uploadTask = storageRef.child(`${this.num}/${file.name}`).put(file)

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
