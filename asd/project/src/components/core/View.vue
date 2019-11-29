<template>
  <div>
    <v-card flat tile color="white">
      <router-view :key="$route.fullPath"></router-view>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
