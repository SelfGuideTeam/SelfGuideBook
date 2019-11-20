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
            <!-- <v-row>
                <v-col cols="10" offset="1">
                    <v-file-input multiple="multiple" label="File input" v-model="fileUpload"></v-file-input>
                </v-col>
            </v-row> -->
            <v-row>
                <v-col cols="10" offset="1">
                    <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25"></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="4">
                    <v-btn text @click="post">작성</v-btn>
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
      fileUpload: [],
      id: this.$route.params.id,
      month: '',
      hour: '',
      minutes: '',
      num: 1,
      view: 0
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
      const d = new Date()
      this.month = d.getMonth() + 1
      if (d.getHours() < 10) {
        this.hour = '0' + d.getHours()
      } else {
        this.hour = d.getHours()
      }
      if (d.getMinutes() < 10) {
        this.minutes = '0' + d.getMinutes()
      } else {
        this.minutes = d.getMinutes()
      }
      const date = d.getFullYear() + '.' + this.month + '.' + d.getDate() + ' ' + this.hour + ':' + this.minutes

      const r = await this.$firebase.firestore().collection('notes').add({
        title: this.title,
        content: this.content,
        date: date,
        category: this.category,
        fileUpload: this.fileUpload,
        num: this.num,
        view: this.view,
        writer: this.writer
      })
      console.log(r)
      this.$router.push('board-page')
      console.log('성공')
    },
    async rewrite () {
      this.title = ''
      this.content = ''
      this.category = ''
      this.fileUpload = ''
    },
    moveToBoard () {
      this.$router.push('board-page')
    }
  }
}
</script>
