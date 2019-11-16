<template>
<v-app>
    <v-container>
      <v-layout>
        <h1>게시글 작성</h1>
      </v-layout>
      <v-layout>
          <v-col cols="3" offset="1">
            <v-overflow-btn
              :items="category"
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
// import EventBus from '../eventBus.js'
export default {
  data () {
    return {
      category: ['아시아', '유럽', '북아메리카', '남아메리카', '오스트레일리아', '아프리카'],
      title: '',
      content: '',
      fileUpload: []
    }
  },
  methods: {
    async post () {
      const r = await this.$firebase.firestore().collection('notes').add({
        title: this.title, content: this.content, date: new Date()
      })
      console.log(r)
      this.title = ''
      this.content = ''
      this.fileUpload = ''
      this.$router.push('board-page')
      console.log('성공')
    },
    // writeBoard (payload) {
    //   EventBus.$emit('writeBoard', payload)
    //   this.$router.push('read-board-page')
    // },
    async rewrite () {
      this.title = ''
      this.content = ''
      this.fileUpload = ''
    },
    moveToBoard () {
      this.$router.push('board-page')
    }
  }
}
</script>
