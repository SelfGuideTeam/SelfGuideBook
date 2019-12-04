<template>
  <v-container>
    <v-row>
      <v-col align="center" justify="center">
        <v-card max-width="1200" flat tile>
          <v-card-title class="display-1">가이드라인</v-card-title>
          <v-divider class="mb-4"></v-divider>
        </v-card>
        <v-card max-width="1200" flat tile outlined>
          <!-- <v-img src="../assets/guideLine/guideline.png" /> -->
          <v-img id="gu" src="https://imgur.com/T6M0uzD.png"></v-img>
          <h2 id="h2" class="headline font-weight-bold mb-3" style="font-size: 100%;">확장프로그램</h2>
          <v-layout justify-center>
            <a
              v-for="(down, i) in download"
              :key="i"
              :href="down.href"
              class="subheading mx-3 mb-12"
              target="_blank"
            >{{ down.text }}</a>
          </v-layout>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  created() {
    sessionStorage.clear();
  },
  data() {
    return {
      download: [
        {
          text: "Download",
          href: "https://chrome.google.com/webstore/category/extensions?hl=ko"
        }
      ]
    };
  }
};
</script>

<style>
#gu {
  margin: 0 auto;
  max-width: 75%;
  max-height: 100%;
}
#h2 {
  text-align: center;
}
</style>
