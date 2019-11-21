<template>
    <v-container>
      <template>
        <v-card v-for="comment in comments" :key="comment.date">
          <v-card-text>
            <v-row wrap>
              <v-col cols="1">
                {{comment.writer}}
              </v-col>
              <v-col>
                {{comment.content}}
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                {{comment.date}}
              </v-col>
            </v-row>
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
      writer: 'B'
    }
  },
  mounted () {
    this.get(this.val)
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
      const date = d.getFullYear() + '.' + this.month + '.' + d.getDate() + ' ' + this.hour + ':' + this.minutes
      this.comments = []
      await this.$firebase.firestore().collection('notes').doc(id).collection('comments').add({
        writer: this.writer, content: this.content, date: date
      })
      console.log(date)
      this.content = ''
      this.get(id)
    },
    async get (id) {
      const snapshot = await this.$firebase.firestore().collection('notes').doc(id).collection('comments').get()
      this.comments = []
      snapshot.forEach(doc => {
        const { writer, content } = doc.data()
        console.log(doc.id, '=>', doc.data())
        this.comments.push({
          writer, content, date: doc.data().date, id: doc.id
        })
      })
      console.log(snapshot)
    }

  }

}
</script>
