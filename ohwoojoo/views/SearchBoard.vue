<template>
  <v-container>
    <v-layout>
      <h1>게시판 검색 결과</h1>
    </v-layout>
    <template>
      <v-simple-table class="mt-5" fixed-header height="500px">
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
              <td @click="moveToRead(item.id)">{{ item.title }}</td>
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
    <v-layout>
      <v-row wrap>
      <v-col cols="6" sm="6" md="4" offset="3">
          <v-text-field
            outlined
            dense
            v-model="wordForSearch"
          ></v-text-field>
        </v-col>
        <v-btn text class="mt-3" @click="searchWithWord(wordForSearch)">
          <v-icon>mdi-magnify</v-icon>
          검색
        </v-btn>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [],
    title: '',
    content: '',
    wordForSearch: '',
    searchItems: [],
    type: '',
    keyword: ''
  }),
  mounted () {
    this.type = this.$route.params.type
    this.keyword = this.$route.params.keyword
    this.search(this.type, this.keyword)
  },
  created () {

  },
  methods: {
    async search (type, keyword) {
      console.log(type)
      await this.$firebase.firestore().collection('notes').where(type, '==', keyword)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const date = new Date(doc.data().date.seconds * 1000)
            const { title, content } = doc.data()
            this.items.push({
              title, content, id: doc.id, date
            })
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    moveToRead (id) {
      console.log(id)
      this.$router.push({
        name: 'readBoard', params: { id }
      })
    },
    moveToWrite () {
      this.$router.push('write-board-page')
    },
    searchWithWord (keyword) {
      this.$router.push({
        name: 'searchBoard', params: { keyword }
      })
    }
  }
}
</script>
