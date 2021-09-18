<template>
  <v-container fluid fill-height>
    <v-layout>
      <v-flex xs5>
        <v-text-field v-model="title" label="title"></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-text-field v-model="content" label="content"></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-btn @click="post">작성</v-btn>
      </v-flex>
    </v-layout>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{ itemsPerPageOptions }"
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title>
                <h4>{{ item.title }}</h4>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>{{ item.content }}</v-card-text>
              <v-card-text>{{ item.id }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="update(item.id)">수정</v-btn>
                <v-btn @click="del(item.id)">삭제</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
import firebase from "firebase";
export default {
  data: () => ({
    itemsPerPageOptions: [4, 8, 12],
    itemsPerPage: 4,
    items: [],
    title: "",
    content: ""
  }),
  mounted() {
    this.get();
  },
  methods: {
    async post() {
      // this.items.push({
      //   title: this.title, content: this.content
      // })
      // this.title = ''
      // this.content = ''
      //   const r =
      await firebase
        .firestore()
        .collection("notes")
        .add({
          title: this.title,
          content: this.content
        });
      //   console.log(r);
      this.title = "";
      this.content = "";
      await this.get();
    },
    async get() {
      const snapshot = await firebase
        .firestore()
        .collection("notes")
        .get();
      this.items = [];
      snapshot.forEach(board => {
        const { title, content } = board.data();
        this.items.push({
          title,
          content,
          id: board.id
        });
      });
      //   console.log(snapshot);
    },
    async update(id) {
      //   const r =
      await firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .set({
          title: this.title,
          content: this.content
        });
      await this.get();
      //   console.log(r);
    },
    async del(id) {
      alert(id);
      //   const r =
      await firebase
        .firestore()
        .collection("notes")
        .doc(id)
        .delete();
      await this.get();
      //   console.log(r);
    }
  }
};
</script>
