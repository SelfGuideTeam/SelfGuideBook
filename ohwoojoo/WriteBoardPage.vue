<template>
    <v-container>
        <v-layout column="column">
            <v-row justify="center">
                <v-col cols="2" offset="1">
                    <v-subheader>제목</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="title"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="10" offset="1">
                    <v-file-input multiple="multiple" label="File input" v-model="fileUpload"></v-file-input>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="10" offset="1">
                    <v-textarea v-model="content" outlined="outlined" no-resize="no-resize" rows="25"></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="3">
                    <v-btn @click="post">작성</v-btn>
                    <v-btn @click="rewrite">재작성</v-btn>
                    <v-btn>취소</v-btn>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      content: '',
      fileUpload: []
    }
  },
  methods: {
    async post () {
      const r = await this.$firebase.firestore().collection('notes').add({
        title: this.title, content: this.content, date: new Date(), fileUpload: this.fileUpload
      })
      console.log(r)
      this.title = ''
      this.content = ''
      this.fileUpload = ''
    },
    async rewrite () {
      this.title = ''
      this.content = ''
      this.fileUpload = ''
    }
  }
}
</script>
