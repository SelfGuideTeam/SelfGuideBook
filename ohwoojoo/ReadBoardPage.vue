<template>
<v-container>
    <v-layout>
        <h1>게시글 읽기</h1>
    </v-layout>
  <v-card class="mt-5">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle>{{category}}</v-list-item-subtitle>
        <v-list-item-title class="headline mt-5">{{title}}</v-list-item-title>
        <v-list-item-subtitle>
          <v-row wrap>
            <v-col>{{writeDate}}</v-col>
            <v-spacer></v-spacer>
            <v-col>{{writer}}</v-col>
          </v-row>
          </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img></v-img>

    <v-card-text>
      {{content}}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
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
</v-container>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      content: '',
      writer: '',
      category: '',
      date: ''
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
          this.writer = doc.data().writer
          this.content = doc.data().content
          this.writeDate = doc.data().date
          this.id = doc.id
          this.category = doc.data().category
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    moveToUpdate (id) {
      this.$router.push({
        name: 'updateBoard', params: { id }
      })
    },
    del (id) {
      this.$firebase.firestore().collection('notes').doc(id).delete()
      console.log('성공')
      this.$router.push('../board-page')
    }
  }
}
</script>
