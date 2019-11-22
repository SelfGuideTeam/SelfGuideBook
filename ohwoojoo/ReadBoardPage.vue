<template>
<v-container>
    <v-layout>
        <h1>게시글 읽기</h1>
    </v-layout>
  <v-card class="mt-5" width="1200">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle>{{category}}</v-list-item-subtitle>
        <v-list-item-title class="headline mt-5">{{title}}</v-list-item-title>
        <v-list-item-subtitle>
          <v-row wrap class="mt-7">
            <v-col>{{date}}</v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-icon class="mr-2">mdi-account</v-icon>
              {{writer}}
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-icon class="mr-2">mdi-eye-outline</v-icon>
              {{view}}
            </v-col>
            <v-col>
              <v-icon class="mr-2">mdi-comment-outline</v-icon>
              {{comments}}
            </v-col>
          </v-row>
          </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider/>

    <v-img></v-img>

    <v-card-text>
      {{content}}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="deep-purple accent-4"
        @click="moveToBoard()"
      >
        목록
      </v-btn>
      <v-btn
        text
        color="deep-purple accent-4"
        @click="moveToUpdate(id)"
      >
        수정
      </v-btn>
      <v-btn
        text
        color="deep-purple accent-4"
        @click="del(id)"
      >
        삭제
      </v-btn>
    </v-card-actions>
  </v-card>
  <span>
    <comments :val="id" v-model="comments"></comments>
  </span>
</v-container>
</template>

<script>
import comments from './comments'
export default {
  components: { comments },
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      content: '',
      writer: '',
      category: '',
      date: '',
      view: 0,
      num: '',
      fileUpload: [],
      comments: ''
    }
  },
  created () {
    // 게시글 가져오기
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
          this.writer = doc.data().writer
          this.content = doc.data().content
          this.date = doc.data().date
          this.id = doc.id
          this.category = doc.data().category
          this.view = doc.data().view
          this.num = doc.data().num
          this.fileUpload = doc.data().fileUpload

          // view +1
          this.view += 1

          // view 업데이트
          this.$firebase.firestore().collection('notes').doc(this.$route.params.id).set({
            title: this.title, content: this.content, category: this.category, writer: this.writer, date: this.date, view: this.view, num: this.num, fileUpload: this.fileUpload
          })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    moveToBoard () {
      this.$router.push('../board-page')
    },
    moveToUpdate (id) {
      this.$router.push({
        name: 'updateBoard', params: { id }
      })
    },
    del (id) {
      this.$firebase.firestore().collection('notes').doc(id).delete()
      console.log('성공')
      this.$router.push('../board-page')
    },
    async updateView (id) {
      const r = await this.$firebase.firestore().collection('notes').doc(id).set({
        title: this.title, content: this.content, category: this.category, writer: this.writer, date: this.date, view: this.view, num: this.num, fileUpload: this.fileUpload
      })
      console.log(r)
    }
  }
}
</script>
