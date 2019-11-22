<template>
    <v-container>
      <template>
        <v-card v-for="comment in comments" :key="comment.date">
          <v-card-text>
            <v-row wrap>
              <v-col cols="2">
                {{comment.writer}}
              </v-col>
              <v-col cols="6">
                {{comment.content}}
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                {{comment.date}}
              </v-col>
              <v-col cols="1">
                <v-btn text color="grey" @click="getSelectedComment(val, comment.id)">
                  <v-icon>mdi-comment-edit</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-btn text color="grey" @click="deleteComment(val, comment.id)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <span>
              <v-row wrap>
                <v-col>
                <v-textarea v-model="rewriteContent" solo rows="3" no-resize>{{rewriteContent}}</v-textarea>
                </v-col>
                <v-col cols="1" class="mt-5">
                    <v-btn text @click="rewriteComment(val, comment.id)">수정</v-btn>
                </v-col>
              </v-row>
            </span>
          </v-card-text>
        </v-card>
      </template>
        <v-layout>
            <v-row wrap offset="1">
                <v-col cols="11">
                    <v-textarea v-model="content" solo rows="3" no-resize="no-resize">{{content}}</v-textarea>
                </v-col>
                <v-col cols="1" class="mt-5">
                    <v-btn text @click="addComment(val)">작성</v-btn>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  props: { val: String },
  data () {
    return {
      content: '',
      comments: [],
      writer: 'B',
      rewriteContent: '',
      rewriteWriter: '',
      date: ''
    }
  },
  mounted () {
    this.getComments(this.val)
  },
  methods: {
    async addComment (id) {
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
      if (d.getSeconds() < 10) {
        this.seconds = '0' + d.getSeconds()
      } else {
        this.seconds = d.getSeconds()
      }
      const date = d.getFullYear() + '.' + this.month + '.' + d.getDate() + ' ' + this.hour + ':' + this.minutes + ':' + this.seconds
      this.comments = []
      await this.$firebase.firestore().collection('notes').doc(id).collection('comments').add({
        writer: this.writer, content: this.content, date: date
      })
      console.log(date)
      this.content = ''
      this.getComments(id)
    },
    async getComments (id) {
      const snapshot = await this.$firebase.firestore().collection('notes').doc(id).collection('comments').orderBy('date', 'asc').get()
      this.comments = []
      snapshot.forEach(doc => {
        const { writer, content } = doc.data()
        console.log(doc.id, '=>', doc.data())
        this.comments.push({
          writer, content, date: doc.data().date, id: doc.id
        })
      })
      console.log(snapshot)
    },
    // 댓글 가져오기
    async getSelectedComment (id1, id2) {
      await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
          } else {
            console.log('Document data:', doc.data())
            this.rewriteContent = doc.data().content
            this.rewriteWriter = doc.data().writer
            this.date = doc.data().date
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    },
    // 댓글 수정하기
    async rewriteComment (id1, id2) {
      await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).set({
        content: this.rewriteContent, writer: this.rewriteWriter, date: this.date
      })
      this.rewriteContent = ''
      this.getComments(id1)
    },
    async deleteComment (id1, id2) {
      const r = await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).delete()
      await this.getComments(id1)
      console.log(r)
    }
  }

}
</script>
