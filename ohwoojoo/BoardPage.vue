<template>
<v-container>
  <v-card width="1200">
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
            <td>{{ item.num }}</td>
            <td @click="moveToRead(item.id)">{{ item.title }}</td>
            <td>{{ item.writer }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.view }}</td>
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
        { text: '번호', value: 'num' },
        {
          text: '제목',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: '작성자', value: 'writer' },
        { text: '날짜', value: 'date' },
        { text: '조회수', value: 'view' },
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
      const snapshot = await this.$firebase.firestore().collection('notes').orderBy('num', 'desc').get()
      snapshot.forEach(board => {
        const { num, title, writer, view, comments } = board.data()
        this.items.push({
          num, title, writer, id: board.id, date: board.data().date, view, comments
        })
      })
      console.log(snapshot)
    },
    moveToRead (id) {
      // readBoard 페이지로 이동
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
