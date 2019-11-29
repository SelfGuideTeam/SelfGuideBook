<template>
  <v-app class="home">
    <div style="font-size:250%;">
      <strong id="best"> BEST.</strong>
      </div>
  <hr id="line" class="one">;
      <v-layout align-center v-for="guideBooks in guideBookss" :key="guideBooks.num">
        
        <v-card
          class="mx-auto"
          max-width="22%"
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="../assets/venice.png"
          >
            <v-card-title>Venice</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">{{ guideBooks.category }}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{ guideBooks.content }}</div>

            <div>{{ guideBooks.title }}</div>
          </v-card-text>
        </v-card>
      </v-layout>
  </v-app>

</template>

<script>
import firebase from "firebase";
export default {
  name: 'home',
  data() {
    return {
      guideBookss: []
    };
  },
  created(){
    var db = firebase.firestore();
    try{    
      var guideBooks = new Array();
      
      const criteriaDate = (Date.now())-1209600000; //2주 전의 날짜
      console.log('criteriaDate : ' +  criteriaDate)
      let guideBookRef = db.collection('notes').where('date', '>', criteriaDate).orderBy('date', 'desc');

      guideBookRef.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
              if(guideBooks.length<3){
                  guideBooks.push(doc.data());
              }else{
                  guideBooks.every(function (doc2, index){
                      if(doc2.view<doc.data().view){
                          guideBooks[index] = doc.data();
                          return false;
                      }else{
                          return true;
                      }
                  });
              }
          });
          this.guideBookss = guideBooks;
          return;
      }).catch(err => {
          console.log('Error getting documents', err);
          return;
      })

  } catch(err){
      res.json({'result' : 'fail'});
      console.log(err);
      return ;
  }
}








}


</script>
<style>
#line{
margin: 0 auto;
width: 80%;
}
#best{
text-align: center;
margin-left: auto;
margin-right: auto;
}
</style>
