<template>
    <div class="sign-up">
        <p>회원가입</p>
        <input v-model="email" type="text" placeholder="email"><br>
        <input v-model="password" type="password" placeholder="password"><br>
        <button v-on:click="signup">가입하기</button>
        <span>또는 <router-link to="/login">로그인</router-link>으로 돌아가기</span>
    </div>
</template>


<script>
import firebase from 'firebase'
export default {
    name: "signUp",
    data(){
        return{
            email:'',
            password:''
        }
    },
    methods: {
        signup(){
            const db = firebase.firestore();
            db.collection('email').add({
                email: this.email,
                password: this.password
            })
            this.email = "";
            this.password = "";
        }
        
    }
}
</script>


<style scoped>

</style>