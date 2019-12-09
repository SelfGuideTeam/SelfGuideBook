<template>
  <v-container>
    <v-row>
      <v-col align="center" justify="center">
        <v-card max-width="1200" flat tile outlined>
          <!-- <v-img src="../assets/guideLine/guideline.png" /> -->
          <v-img id="gu" src="https://imgur.com/Yzl3PxR.jpg"></v-img>
          <!-- <h2 id="h2" class="headline font-weight-bold mb-3" style="font-size: 100%;">확장프로그램</h2> -->
          <v-layout justify-center>
            <a
              v-for="(down, i) in download"
              :key="i"
              :href="down.href"
              class="subheading mx-3"
              target="_blank"
            >
              <v-img src="https://imgur.com/qX72zxF.jpg" width="150px" class="mt-5" />
            </a>
          </v-layout>
          <v-img src="https://imgur.com/t7eTnOL.jpg" max-width="840" />
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
          href: "https://chrome.google.com/webstore/detail/travelbooks/lgcpblahkafiididodgbpfakejnipbib"
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