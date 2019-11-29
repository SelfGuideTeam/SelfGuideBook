<template>
  <v-app>
    <!-- <Drawer></Drawer> -->
    <Toolbar></Toolbar>
    <CoreView></CoreView>
    <Footer></Footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {
    // Drawer: () => import("@/components/core/Drawer"),
    Toolbar: () => import("@/components/core/Toolbar"),
    Footer: () => import("@/components/core/Footer"),
    CoreView: () => import("@/components/core/View")
  },

  data: () => ({
    //
  }),
  methods: {
    goForum() {
      this.$router.push("main");
    }
  }
};
</script>
