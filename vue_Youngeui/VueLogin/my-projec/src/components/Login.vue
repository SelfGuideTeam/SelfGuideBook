<template>
    <div class="login">
        <h3>Login</h3>
        <input type="text" placeholder="email"><br>
        <input type="password" placeholder="password"><br>
        <button v-on:click="login">로그인</button>
        <p>만약 계정이 없다면, <router-link to="/signup">회원가입</router-link>을 먼저 진행해주세요!</p>
    </div>
</template>


<script>
export default {
    name: "login",
    data() {
        return {

        }
    },
    methods: {
        login(){
            
        }

    }
}
</script>

<style scoped>

</style>