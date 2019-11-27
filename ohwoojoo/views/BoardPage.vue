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
            <td>{{ item.numOfComments }}</td>
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
        { text: '번호', value: 'num', filterable: false },
        {
          text: '제목',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: '작성자', value: 'writer', filterable: false },
        { text: '날짜', value: 'date', filterable: false },
        { text: '조회수', value: 'view', filterable: false },
        { text: '댓글', value: 'comments', filterable: false }
      ],
      items: [],
      date: ''
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    async get () {
      const snapshot = await this.$firebase.firestore().collection('notes').orderBy('num', 'desc').get()
      snapshot.forEach(board => {
        const { num, title, writer, view, numOfComments } = board.data()

        var d = new Date(board.data().date)
        var year = d.getFullYear()
        var month = '0' + (d.getMonth() + 1)
        var day = '0' + d.getDate()
        var hour = '0' + d.getHours()
        var minute = '0' + d.getMinutes()
        this.date = year + '.' + month.substr(-2) + '.' + day.substr(-2) + ' ' + hour.substr(-2) + ':' + minute.substr(-2)

        this.items.push({
          num, title, writer, id: board.id, date: this.date, view, numOfComments
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
