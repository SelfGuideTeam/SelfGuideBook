<template>
    <div class="login">
        <h3>Login</h3>
        <input v-model="email" type="text" placeholder="email"><br>
        <input v-model="password" type="password" placeholder="password"><br>
        <button v-on:click="login">로그인</button>
        <p>만약 계정이 없다면, <router-link to="/signup">회원가입</router-link>을 먼저 진행해주세요!</p>
    </div>
</template>


<script>
export default {
    name: "login",
    data() {
        return {
            email:"",
            password:""
        }
    },
    methods: {
        login(){
            var email = this.email;
            var password = this.password;

            db.collection('cafes').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {

                li.setAttribute('data-id', doc.id);
                name.textContent = doc.id;
                city.textContent = doc.data().city;

                li.appendChild(name);
                li.appendChild(city);
                cafeList.appendChild(li);
                }); 
                
            })
        }

    }
}
</script>

<style scoped>

</style>