<template>
    <v-container>
        <v-layout>
            <v-row wrap offset="1">
                <v-col cols="11">
                    <v-textarea v-model="contents" solo rows="3" no-resize="no-resize">{{contents}}</v-textarea>
                </v-col>
                <v-col cols="1" class="mt-5">
                    <v-btn text @click="addComment">작성</v-btn>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  data () {
    return {
      contents: '',
      comments: []
    }
  },
  methods: {
    addComment () {

    }
  }

}
</script>
