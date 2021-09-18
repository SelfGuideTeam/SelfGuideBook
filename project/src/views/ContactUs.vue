<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-card width="1200" elevation="10">
          <v-card-title class="display-1">Contact Us</v-card-title>
          <v-img src="https://imgur.com/fapAJ9e.jpg"></v-img>
          <v-card-text align="start" class="title">
            고객센터 C/S Center
            <br />전화 : 02.1234.1234
            <br />팩스 : 02.1234.1234
            <br />이메일 :
            rohyunge2@naver.com
            <br />카카오톡 ID : rohyunge2
            <br />오전 9시부터
            오후 6시까지 상담가능합니다.
            <br />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  created() {
    sessionStorage.clear();
  }
};
</script>

<style></style>
