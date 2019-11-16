<template>
<v-container>
    <v-layout>
        <h1>게시글 읽기</h1>
    </v-layout>
    <v-divider></v-divider>
  <v-card>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{items.title}}</v-list-item-title>
        <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img></v-img>

    <v-card-text>
      Visit ten places on our planet that are undergoing the biggest changes today.
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
import EventBus from '../eventBus.js'
export default {
  data () {
    return {
      items: []
    }
  },
  created () {
    EventBus.$on('receiveID', (payload) => {
      console.log(payload)
      this
        .$firebase
        .firestore()
        .collection('notes')
        .doc(payload.id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
          } else {
            console.log('Document data:', doc.data())
            this.items.push({
              title: doc.data().title,
              content: doc.data().content,
              writeDate: new Date(doc.data().date.seconds * 1000)
            })
            console.log(this.items)
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
    })
  }
  // mounted () {
  //   this.read()
  // }
  // methods: {
  //   async read (id) {
  //     const article = await this
  //       .$firebase
  //       .firestore()
  //       .collection('notes')
  //       .doc(id)
  //       .get()
  //       .then(doc => {
  //         if (!doc.exists) {
  //           console.log('No such document!')
  //         } else {
  //           console.log('Document data:', doc.data())
  //           const date = doc.data().date.seconds * 1000
  //           console.log(date)
  //           this.items.push({
  //             title: doc.data().title,
  //             content: doc.data().content,
  //             writeDate: doc.data().date
  //           })
  //         }
  //       })
  //       .catch(err => {
  //         console.log('Error getting document', err)
  //       })
  //     console.log(article)
  //   }
  // }

}
</script>
