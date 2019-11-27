<template>
    <v-card>
        <v-card-text>삭제하시겠습니까? </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cancelDeleteComment(val.id1, val.id2); sendDialog2();">
                취소</v-btn>
            <v-btn color="green darken-1" text @click="deleteComment(val.id1, val.id2); sendDialog2();">
                확인</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
  props: { val: Object },
  data () {
    return {
      content: '',
      writer: 'B',
      rewriteContent: '',
      rewriteWriter: '',
      date: '',
      dialog2: false,
      // 게시글 필드
      notesTitle: '',
      notesContent: '',
      notesWriter: '',
      notesCategory: '',
      notesDate: '',
      filenames: [],
      num: '',
      view: 0,
      numOfComments: 0
    }
  },
  methods: {
    // 댓글 삭제
    async deleteComment (id1, id2) {
      await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).delete()
      this.minusComments(id1)
    },
    // 댓글 삭제 취소
    async cancelDeleteComment (id1, id2) {

    },
    // comments.vue로 dialog2 = false 보내기
    sendDialog2 () {
      this.$emit('sendDialog2', this.dialog2)
    },
    // 댓글 수 -1
    async minusComments (id) {
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
            // 댓글 수 -1
            this.numOfComments -= 1
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
    }
  }
}
</script>
