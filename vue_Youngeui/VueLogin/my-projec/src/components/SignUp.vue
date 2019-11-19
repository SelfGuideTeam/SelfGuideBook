<template>
  <div class="sign-up">
    <p>회원가입</p>
    <input v-model="email" type="text" placeholder="email" />
    <br />
    <input v-model="password" type="password" placeholder="password" />
    <br />
    <button v-on:click="signup">가입하기</button>
    <span>
      또는
      <router-link to="/login">로그인</router-link>으로 돌아가기
    </span>
  </div>
</template>


<script>
import firebase from "firebase";
export default {
  name: "signUp",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    signup() {
      // const db = firebase.firestore();
      // db.collection("email").add({
      //   email: this.email,
      //   password: this.password
      // });

      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          alert(JSON.stringify(user));
          // ...
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });

      // firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
      this.email = "";
      this.password = "";
    }
  }
};
</script>


<style scoped>
</style>