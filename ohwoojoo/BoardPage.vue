<template>
<v-container>
  <v-card>
    <v-card-title>
      게시판
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="검색"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
    >
        <template v-slot:item="{item}">
          <tr>
            <td @click="moveToRead(item.id)">{{ item.title }}</td>
            <td>{{ item.writer }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.hits }}</td>
            <td>{{ item.comments }}</td>
          </tr>
        </template>
    </v-data-table>
  </v-card>
  <v-layout>
        <v-spacer></v-spacer>
        <v-btn text class="mt-5" @click="moveToWrite">작성</v-btn>
    </v-layout>
</v-container>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: '제목',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: '작성자', value: 'writer' },
        { text: '날짜', value: 'date' },
        { text: '조회수', value: 'hits' },
        { text: '댓글', value: 'comments' }
      ],
      items: []
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    async get () {
      const snapshot = await this.$firebase.firestore().collection('notes').get()
      // this.items = []
      snapshot.forEach(board => {
        const { title, writer, hits, comments } = board.data()
        this.items.push({
          title, writer, id: board.id, date: board.data().date, hits, comments
        })
      })
      console.log(snapshot)
    },
    moveToRead (id) {
      console.log(id)
      this.$router.push({
        name: 'readBoard', params: { id }
      })
    },
    moveToWrite () {
      this.$router.push('write-board-page')
    }
  }
}
</script>
