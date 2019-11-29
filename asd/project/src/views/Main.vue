<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-card flat width="1200">
          <v-carousel
            class="mx-auto"
            cycle
            show-arrows-on-hover
            hide-delimiter-background
            continous
          >
            <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src"></v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>
    <div style="font-size:250%;">
      <strong id="best">BEST.</strong>
    </div>
    <v-row justify="center">
      <v-col
        xs="12"
        sm="6"
        md="6"
        lg="3"
        xl="3"
        v-for="guideBook in guideBooks"
        :key="guideBook.num"
      >
        <v-card class="mx-auto" max-width="350" @click="readBest(guideBook)">
          <v-img class="white--text" height="200px" src="../assets/mainPagePhoto/venice.png">
            <v-card-title>Venice</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">
            {{
            guideBook.category
            }}
          </v-card-subtitle>

          <v-card-text class="text--primary" align="start">
            <div>{{ guideBook.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  props: {},

  created() {
    sessionStorage.clear();
    var db = firebase.firestore();

    try {
      const criteriaDate = Date.now() - 1209600000; //2주 전의 날짜
      let guideBookRef = db
        .collection("notes")
        .where("date", ">", criteriaDate)
        .orderBy("date", "desc");

      var tempBooks = new Array();
      guideBookRef
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var email = { docid: doc.id };
            var data2 = Object.assign(doc.data(), email);
            tempBooks.push(data2);
            console.log(data2);
          });
          tempBooks.sort((a, b) => {
            return a.view > b.view ? -1 : a.view < b.view ? 1 : 0;
          });
          this.guideBooks = tempBooks.slice(0, 4);
          return;
        })
        .catch(err => {
          console.log("Error getting documents", err);
          return;
        });
    } catch (err) {
      console.log(err);
      return;
    }
  },
  data() {
    return {
      guideBooks: [],
      items: [
        {
          src:
            "https://www.telegraph.co.uk/content/dam/Travel/2018/September/Frankfurt-christmas-market-iStock-520625727.jpg?imwidth=1400",
          href:
            "https://kr.france.fr/ko/happening-now-in-france/marches-de-noel-en-alsace"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2014/06/06/09/36/sydney-363244_1280.jpg",
          href:
            "https://www.australia.com/ko-kr/places/sydney-and-surrounds/guide-to-sydney.html"
        },
        {
          src:
            "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
          href:
            "https://www.google.co.kr/destination?q=%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C&output=search&dest_mid=/m/03rj0&sa=X&ved=2ahUKEwiZivHk04TmAhVU-WEKHWANBjIQri4wJ3oECAwQAw"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2015/03/11/12/31/new-york-668616_1280.jpg",
          href:
            "https://www.google.com/search?sxsrf=ACYBGNR9kmLvHunQ7TVpeWup4MC6cumX3g%3A1574658141933&ei=XWDbXYHGOMXAoASMq4CICA&q=%EB%89%B4%EC%9A%95&oq=%EB%89%B4%EC%9A%95&gs_l=psy-ab.3..0i67j0i131j0j0i131j0l6.340159.341719..341877...3.2..0.153.1111.0j8......0....1..gws-wiz.......0i71j35i39j0i13.cdO_yHAJ560&ved=0ahUKEwjB6MTZyoTmAhVFIIgKHYwVAIEQ4dUDCAs&uact=5"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2017/05/10/18/16/pyramid-2301471_1280.jpg",
          href:
            "https://www.google.co.kr/travel/guide?q=%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C&sa=X&output=search&tra=%5B%22AMAbHIIqRuVGEdmRRk-chWfLbZatyOSylA:1574660839472%22,%22%EC%9D%B4%EC%A7%91%ED%8A%B8%22,%22/m/03rj0%22%5D&tcfs=EhsKCC9tLzAzcmowEg_slYTsnbTsiqzrnoDrk5w&dest_mid=/m/02k54#dest_mid=/m/02k54&tcfs=EhUKCC9tLzAyazU0EgnsnbTsp5Htirg"
        }
      ]
    };
  },
  components: {},
  methods: {
    readBest(itm) {
      sessionStorage.setItem("items", JSON.stringify(itm));
      this.$router.push("ReadBoardPage");
    }
  }
};
</script>
<style></style>
