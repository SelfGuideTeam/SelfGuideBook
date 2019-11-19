<template>
<v-app>
    <v-container>
      <v-layout>
        <h1>게시글 작성</h1>
      </v-layout>
      <v-layout>
          <v-col cols="3" offset="1">
            <v-overflow-btn
              v-model="selectedCategory"
              :items="category"
              label="카테고리 선택"
            >{{selectedCategory}}</v-overflow-btn>
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
                <v-col cols="4">
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
      category: ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
      selectedCategory: '',
      title: '',
      content: '',
      writer: '',
      date: '',
      fileUpload: [],
      id: this.$route.params.id
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
          this.selectedCategory = doc.data().category
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    async update (id) {
      const r = await this.$firebase.firestore().collection('notes').doc(id).set({
        title: this.title, content: this.content, category: this.selectedCategory, writer: this.writer, date: this.date
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
