<template>
  <div class="Guideline">
    <v-img id="gu" src="../assets/guideline.png"></v-img>
    <h2 id="h2" class="headline font-weight-bold mb-3" style="font-size: 100%;">확장프로그램</h2>
    <v-layout justify-center>
      <a
        v-for="(down, i) in download"
        :key="i"
        :href="down.href"
        class="subheading mx-3"
        target="_blank"
      >{{ down.text }}</a>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Guide",
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
