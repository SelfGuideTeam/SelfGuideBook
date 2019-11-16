<template>
    <v-container>
    <v-btn @click="read(id)">읽기</v-btn>
        <v-data-iterator :items="items">
            <template v-slot:default="props">
                <v-row>
                    <v-col v-for="item in props.items" :key="item.name" cols="10" offset="1">
                        <v-card>
                            <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                {{item.content}}
                            </v-card-text>
                            <v-card-text>
                                {{item.id}}
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn>수정</v-btn>
                              <v-btn>삭제</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </v-container>
</template>

<script>
import EventBus from '../eventBus.js'
export default {
  data: () => ({
    items: []
    // title: '',
    // content: '',
    // date: '',
    // id: ''
  }),
  mounted () {
    // this.read()
  },
  created () {
    EventBus.$on('receiveID', (payload) => {
      console.log(payload)
      this.id = payload
    })
    EventBus.$on('writeBoard', (payload) => {
      console.log(payload)
    })
  },
  methods: {
    async read (id) {
      const article = await this
        .$firebase
        .firestore()
        .collection('notes')
        .doc(id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!')
          } else {
            console.log('Document data:', doc.data())
            this.items.push({
              title: doc.data().title,
              content: doc.data().content,
              writeDate: doc.data().date
            })
          }
        })
        .catch(err => {
          console.log('Error getting document', err)
        })
      console.log(article)
    }
  }
}
</script>
