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
              <td>{{ item.title }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </v-container>
</template>

<script>
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
        const { title, content } = board.data()
        this.items.push({
          title, content, id: board.id
        })
      })
      console.log(snapshot)
    }
  }
}
</script>
