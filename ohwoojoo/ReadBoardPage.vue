<template>
<v-container>
    <v-layout>
        <h1>게시글 읽기</h1>
    </v-layout>
    <v-divider></v-divider>
  <v-card>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{items[0].title}}</v-list-item-title>
        <v-list-item-subtitle>{{items[0].writeDate}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img></v-img>

    <v-card-text>
      {{items[0].content}}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="deep-purple accent-4"
      >
        수정
      </v-btn>
      <v-btn
        text
        color="deep-purple accent-4"
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
    const boardID = this.$route.params.id
    return {
      items: [],
      id: boardID
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
          const date = new Date(doc.data().date.seconds * 1000)
          this.items.push({
            title: doc.data().title,
            content: doc.data().content,
            writeDate: date
          })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  }
}
</script>
