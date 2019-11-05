<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <router-view />
    <login message="하하하하하"></login><
    <router-view></router-view>
  </div>
</template>

<script>
import login from "./components/Login";
import signup from "./components/SignUp";

export default {
  name: "App",
  components: {
    login,
    signup
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
