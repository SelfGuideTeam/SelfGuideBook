<template>
  <v-container fluid>
    <v-data-iterator
      :items="comments"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{ itemsPerPageOptions }"
    >
      <template v-slot="{itmes}">
          <v-col
            v-for="comment in comments"
            :key="comment.date"
            cols="12"
          >
              <v-card>
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
              </v-card-text>
            </v-card>
          </v-col>
      </template>
    </v-data-iterator>
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
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog1" persistent max-width="400">
          <rewrite-comment :val="rewrite" v-on:sendDialog1="receiveDialog1"/>
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout row justify-center>
        <v-dialog v-model="dialog2" persistent max-width="400">
          <delete-comment :val="del" v-on:sendDialog2="receiveDialog2"/>
        </v-dialog>
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import rewriteComment from '../components/rewriteComment'
import deleteComment from '../components/deleteComment'
export default {
  props: { val: String },
  components: { rewriteComment, deleteComment },
  data () {
    return {
      itemsPerPageOptions: [5, 10, 15],
      itemsPerPage: 5,
      content: '',
      comments: [],
      writer: 'B',
      rewriteContent: '',
      rewriteWriter: '',
      date: '',
      // 게시글 필드
      notesTitle: '',
      notesContent: '',
      notesWriter: '',
      notesCategory: '',
      notesDate: '',
      filenames: [],
      num: '',
      view: 0,
      numOfComments: 0,
      // dialog
      dialog1: false,
      dialog2: false,
      rewrite: {
        id1: this.val,
        id2: ''
      },
      del: {
        id1: this.val,
        id2: ''
      }
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
      // 게시글 컬렉션에 댓글 수 +1
      this.plusComments(id)
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
      this.dialog1 = true
      this.rewrite.id2 = id2
    },
    async deleteComment (id1, id2) {
      this.dialog2 = true
      this.del.id2 = id2

      // const r = await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).delete()
      // await this.getComments(id1)
      // console.log(r)
      // // 게시글 도큐먼트에 댓글 수 -1
      // this.minusComments(id1)
    },
    // 댓글 수 +1
    async plusComments (id) {
      // 게시글 가져오기
      await this
        .$firebase
        .firestore()
        .collection('notes')
        .doc(id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
          } else {
            console.log('Document data:', doc.data())
            this.notesTitle = doc.data().title
            this.notesDate = doc.data().date
            this.notesContent = doc.data().content
            this.notesWriter = doc.data().writer
            this.notesCategory = doc.data().category
            this.num = doc.data().num
            this.view = doc.data().view
            this.filenames = doc.data().filenames
            this.numOfComments = doc.data().numOfComments
            // 댓글 수 +1
            this.numOfComments += 1
            // 게시글 도큐먼트 수정
            this.$firebase.firestore().collection('notes').doc(id).set({
              title: this.notesTitle,
              content: this.notesContent,
              category: this.notesCategory,
              writer: this.notesWriter,
              date: this.notesDate,
              filenames: this.filenames,
              num: this.num,
              view: this.view,
              numOfComments: this.numOfComments
            })
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    },
    // // 댓글 수 -1
    // async minusComments (id) {
    //   // 게시글 가져오기
    //   await this
    //     .$firebase
    //     .firestore()
    //     .collection('notes')
    //     .doc(id)
    //     .get()
    //     .then(doc => {
    //       if (!doc.exists) {
    //         console.log('No such document!')
    //       } else {
    //         console.log('Document data:', doc.data())
    //         this.notesTitle = doc.data().title
    //         this.notesDate = doc.data().date
    //         this.notesContent = doc.data().content
    //         this.notesWriter = doc.data().writer
    //         this.notesCategory = doc.data().category
    //         this.num = doc.data().num
    //         this.view = doc.data().view
    //         this.filenames = doc.data().filenames
    //         this.numOfComments = doc.data().numOfComments
    //         // 댓글 수 -1
    //         this.numOfComments -= 1
    //         // 게시글 도큐먼트 수정
    //         this.$firebase.firestore().collection('notes').doc(id).set({
    //           title: this.notesTitle,
    //           content: this.notesContent,
    //           category: this.notesCategory,
    //           writer: this.notesWriter,
    //           date: this.notesDate,
    //           filenames: this.filenames,
    //           num: this.num,
    //           view: this.view,
    //           numOfComments: this.numOfComments
    //         })
    //       }
    //     })
    //     .catch(err => {
    //       console.log('Error getting document', err)
    //     })
    // },
    receiveDialog1 (msg) {
      this.dialog1 = msg
      this.getComments(this.val)
    },
    receiveDialog2 (msg) {
      this.dialog2 = msg
      this.getComments(this.val)
    }
  }

}
</script>
