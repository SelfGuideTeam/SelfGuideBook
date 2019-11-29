<template>
  <v-container>
    <v-col cols="12" align="center">
      <v-card width="1200">
        <v-card-title class="display-1">게시글 읽기</v-card-title>
        <v-card class="mt-5" width="1200">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>{{category}}</v-list-item-subtitle>
              <v-list-item-title class="headline mt-5">{{title}}</v-list-item-title>
              <v-list-item-subtitle>
                <v-row wrap class="mt-7">
                  <v-col>{{date}}</v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-icon class="mr-2">mdi-account</v-icon>
                    {{writer}}
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-icon class="mr-2">mdi-eye-outline</v-icon>
                    {{view}}
                  </v-col>
                  <v-col>
                    <v-icon class="mr-2">mdi-comment-outline</v-icon>
                    {{numOfComments}}
                  </v-col>
                </v-row>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item-content @click="downloadFiles" v-for="filename in filenames" :key="filename">
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <a class="caption">{{filename}}</a>
              </v-col>
            </v-row>
          </v-list-item-content>
          <v-divider />

          <v-img></v-img>

          <!-- <v-card-text v-html="content"></v-card-text> -->

          <!-- 수정 -->
          <!-- editor -->
          <viewer v-model="content" />
          <!-- 수정 -->

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="deep-purple accent-4" @click="moveToBoard()">목록</v-btn>
            <v-btn text color="deep-purple accent-4" @click="moveToUpdate(id)">수정</v-btn>
            <v-btn text color="deep-purple accent-4" @click="del(id)">삭제</v-btn>
          </v-card-actions>
        </v-card>
        <span>
          <comments :val="id"></comments>
        </span>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
//
//
// 수정
import comments from './comments'
import { Editor, Viewer } from '@toast-ui/vue-editor'
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
// 수정
//
//

export default {
  //
  //
  // 수정
  components: { comments, Viewer },
  // 수정
  //
  //
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      content: '',
      writer: '',
      category: '',
      date: '',
      view: 0,
      num: '',
      filenames: [],
      numOfComments: 0
    }
  },
  created () {
    // 게시글 가져오기
    this.$firebase
      .firestore()
      .collection('notes')
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!')
        } else {
          console.log('Document data:', doc.data())
          var d = new Date(doc.data().date)
          var year = d.getFullYear()
          var month = '0' + (d.getMonth() + 1)
          var day = '0' + d.getDate()
          var hour = '0' + d.getHours()
          var minute = '0' + d.getMinutes()
          this.date =
            year +
            '.' +
            month.substr(-2) +
            '.' +
            day.substr(-2) +
            ' ' +
            hour.substr(-2) +
            ':' +
            minute.substr(-2)
          this.title = doc.data().title
          this.writer = doc.data().writer
          this.content = doc.data().content
          this.id = doc.id
          this.category = doc.data().category
          this.view = doc.data().view
          this.num = doc.data().num
          this.filenames = doc.data().filenames
          this.numOfComments = doc.data().numOfComments

          // view +1
          this.view += 1

          // view 업데이트
          this.$firebase.firestore().collection('notes').doc(this.$route.params.id).update({ view: this.view })
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
  },
  methods: {
    moveToBoard () {
      this.$router.go(-1)
    },
    moveToUpdate (id) {
      this.$router.push({
        name: 'UpdateBoardPage',
        params: { id }
      })
    },
    del (id) {
      this.$firebase
        .firestore()
        .collection('notes')
        .doc(id)
        .delete()
      console.log('성공')
      this.$router.go(-1)
    },
    // async updateView (id) {
    //   const r = await this.$firebase
    //     .firestore()
    //     .collection('notes')
    //     .doc(id)
    //     .set({
    //       title: this.title,
    //       content: this.content,
    //       category: this.category,
    //       writer: this.writer,
    //       date: this.date,
    //       view: this.view,
    //       num: this.num,
    //       filenames: this.filenames,
    //       numOfComments: this.numOfComments
    //     })
    //   console.log(r)
    // },
    downloadFiles () {
      const storageRef = this.$firebase.storage().ref()
      for (var i = 0; i < this.filenames.length; i++) {
        var starsRef = storageRef.child(
          `board/${this.num}/${this.filenames[i]}`
        )
        starsRef
          .getDownloadURL()
          .then(url => {
            console.log(url)
            let link = document.createElement('a')
            link.href = url
            link.download = url
            link.click()
          })
          .catch(error => {
            console.log(error.code)
          })
      }
    }
  }
}
</script>
