<template>
  <v-container>
    <v-layout>
      <h1>게시판</h1>
    </v-layout>
    <template>
      <v-simple-table fixed-header height="500px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Title</th>
              <th class="text-center">Writer</th>
              <th class="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td @click="sendID(item)">{{ item.title }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
    <v-layout>
        <v-spacer></v-spacer>
        <v-btn text @click="moveToWrite">작성</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import EventBus from '../eventBus.js'
export default {
  data: () => ({
    items: [],
    title: '',
    content: ''
  }),
  mounted () {
    this.get()
  },
  methods: {
    async get () {
      const snapshot = await this.$firebase.firestore().collection('notes').get()
      this.items = []
      snapshot.forEach(board => {
        const date = new Date(board.data().date.seconds * 1000)
        const { title, content } = board.data()
        this.items.push({
          title, content, id: board.id, date
        })
      })
      console.log(snapshot)
    },
    sendID (payload) {
      EventBus.$emit('receiveID', payload)
      this.$router.push('read-board-page')
    },
    moveToWrite () {
      this.$router.push('write-board-page')
    }
  }
}
</script>
