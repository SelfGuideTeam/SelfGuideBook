<template>
  <div class="login">
    <h3>Login</h3>
    <input v-model="email" type="text" placeholder="email" />
    <br />
    <input v-model="password" type="password" placeholder="password" />
    <br />
    <button v-on:click="login">로그인</button>
    <p>
      만약 계정이 없다면,
      <router-link to="/signup">회원가입</router-link>을 먼저 진행해주세요!
    </p>
  </div>
</template>


<script>
import firebase from "firebase";

export default {
  name: "login",
  props: ["message"],
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      var email = this.email;
      var password = this.password;
      const db = firebase.firestore();
      db.collection("email")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            console.log(
              doc.id + "/" + doc.data().email + "/" + doc.data().password
            );
            if (email === doc.data().email) {
              if (password === doc.data().password) {
                alert("로그인성공");
              }
            }
          });
        });
    }
  },
  created() {
    this.email = this.$props.message;
  }
};
</script>

<style scoped>
</style>