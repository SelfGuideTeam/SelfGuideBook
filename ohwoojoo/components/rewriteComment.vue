<template>
    <v-card>
              <v-card-text>
                <v-textarea v-model="rewriteContent" solo rows="3" no-resize>{{rewriteContent}}</v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelRewriteComment(val.id1, val.id2); sendDialog1();">취소</v-btn>
                <v-btn color="blue darken-1" text @click="rewriteComment(val.id1, val.id2); sendDialog1();">수정</v-btn>
              </v-card-actions>
            </v-card>
</template>
<script>
export default {
  props: { val: Object },
  data () {
    return {
      rewriteContent: '',
      rewriteWriter: '',
      date: '',
      dialog1: false
    }
  },
  methods: {
    // 댓글 수정하기
    async rewriteComment (id1, id2) {
      // this.getSelectedComment(id1, id2)
      await this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).set({
        content: this.rewriteContent, writer: this.rewriteWriter, date: this.date
      })
    },
    // 댓글 수정 취소
    async cancelRewriteComment (id1, id2) {
      this.getSelectedComment(id1, id2)
    },
    // comments.vue로 dialog1 = false 보내기
    sendDialog1 () {
      this.$emit('sendDialog1', this.dialog1)
    },
    getSelectedComment (id1, id2) {
      // 댓글 가져오기
      this.$firebase.firestore().collection('notes').doc(id1).collection('comments').doc(id2).get()
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
    }
  },
  created () {
    this.getSelectedComment(this.val.id1, this.val.id2)
  }

}
</script>
