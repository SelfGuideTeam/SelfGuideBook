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
            <!-- <v-row>
                <v-col cols="10" offset="1">
                    <v-file-input multiple="multiple" label="File input" v-model="fileUpload"></v-file-input>
                </v-col>
            </v-row> -->
            <v-row>
                <v-col cols="10" offset="1">
                    <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25">{{content}}</v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="3">
                    <v-btn text @click="update(id)">수정</v-btn>
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
      writer: '',
      date: '',
      fileUpload: [],
      id: this.$route.params.id,
      view: '',
      num: ''
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
          this.fileUpload = doc.data().fileUpload
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    async update (id) {
      const r = await this.$firebase.firestore().collection('notes').doc(id).set({
        title: this.title, content: this.content, category: this.category, writer: this.writer, date: this.date, fileUpload: this.fileUpload, num: this.num, view: this.view
      })
      console.log(r)
      this.$router.push({ name: 'Board' })
    },
    moveToBoard () {
      this.$router.push('board-page')
    }
  }
}
</script>
