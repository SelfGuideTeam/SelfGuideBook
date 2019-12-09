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
            <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src">
              <!-- <v-card class="mt-10"  tile flat color="transparent">
                           
                          <h2 @click="click(i)"><v-icon>mdi-magnify</v-icon>  이 장소가 궁금하지않나요?</h2>
                         </v-card>
                             
                   
                         <v-card class="mt-10" tile flat color="transparent">
                        <h3 class="h3" @click="click1(i)"><v-icon>mdi-magnify</v-icon> 여행을 계획하고 계신가요? </h3>
                          <h3> MSN 날씨에서
                             최신 일기 예보를 알아보세요! </h3>
              </v-card>-->
              <v-hover v-slot:default="{ hover }">
                <v-card class="grid12-6" v-if="$vuetify.breakpoint.mdAndUp">
                  <!-- <v-card class="inner_box" @click="click(i)" tile flat color="transparent"> -->
                  <v-card
                    :elevation="hover ? 12 : 0"
                    class="inner_box"
                    @click="click(i)"
                    tile
                    flat
                    color="transparent"
                  >
                    <h2>
                      <v-icon>mdi-magnify</v-icon>이 장소가 궁금하지않나요?
                    </h2>
                  </v-card>
                </v-card>
              </v-hover>
              <v-hover v-slot:default="{ hover }">
                <v-card class="grid12-6" v-if="$vuetify.breakpoint.mdAndUp">
                  <v-card
                    :elevation="hover ? 12 : 0"
                    class="inner_box1"
                    @mousemove="extend = !extend"
                    @click="click1(i)"
                    tile
                    flat
                    color="transparent"
                  >
                    <h3 class="h3">
                      <v-icon>mdi-magnify</v-icon>여행을 계획하고 계신가요?
                    </h3>
                    <h3 v-if="extend">MSN 날씨에서 최신 일기 예보를 알아보세요!</h3>
                  </v-card>
                </v-card>
              </v-hover>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>
    <div style="font-size:250%;">
      <strong id="best" class="mt-12">BEST.</strong>
    </div>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="6"
        md="6"
        lg="3"
        xl="3"
        v-for="guideBook in guideBooks"
        :key="guideBook.num"
      >
        <v-card class="mx-auto" max-width="350" @click="readBest(guideBook)">
          <v-img class="white--text" height="200px" :src="getFirstImg(guideBook)">
            <v-card-title>{{ guideBook.category }}</v-card-title>
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
    this.$store.commit("resetMainPhotos");
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
      AsiaPhoto: [
        "https://imgur.com/zXUVV28.png",
        "https://imgur.com/8JJ7DMB.png",
        "https://imgur.com/t7CKbTx.png",
        "https://imgur.com/0MkaeSG.png",
        "https://imgur.com/6VvGDVz.png",

        "https://imgur.com/eBsru4A.png",
        "https://imgur.com/3GmXUVc.png",
        "https://imgur.com/V96PAel.png",
        "https://imgur.com/l1Emeau.png",
        "https://imgur.com/adwx32O.png",
        "https://imgur.com/jQbP5W4.png",
        "https://imgur.com/DAeclV9.png"
      ],
      EuropePhoto: [
        "https://imgur.com/4djSZlP.png",
        "https://imgur.com/ZFFOeNV.png",
        "https://imgur.com/eI3PxWn.png",
        "https://imgur.com/Fbkzgf6.png",
        "https://imgur.com/TB2g930.png",

        "https://imgur.com/nasGx6j.png",
        "https://imgur.com/ZRF6pHA.png",
        "https://imgur.com/LY0I8KH.png",
        "https://imgur.com/4B7e9yE.png",
        "https://imgur.com/2QstxP4.png",
        "https://imgur.com/AA6HB4a.png"
      ],
      NorthAmericaPhoto: [
        "https://imgur.com/JKIms1o.png",
        "https://imgur.com/eujryUd.png",
        "https://imgur.com/AoWCjyV.png",
        "https://imgur.com/HjAErx7.png",
        "https://imgur.com/0AGmT3i.png",

        "https://imgur.com/ZsJuUqg.png",
        "https://imgur.com/kcSZREg.png",
        "https://imgur.com/O2JLGP7.png",
        "https://imgur.com/q0z46BT.png",
        "https://imgur.com/vGeuJY3.png",
        "https://imgur.com/z2ZTO08.png",
        "https://imgur.com/F1Xxi5P.png"
      ],
      SouthAmericaPhoto: [
        "https://imgur.com/YkNG3GD.png",
        "https://imgur.com/RWQPtVr.png",
        "https://imgur.com/ldrF81p.png",
        "https://imgur.com/JKirejf.png",
        "https://imgur.com/GICJCt3.png",

        "https://imgur.com/pKeKMBc.png",
        "https://imgur.com/xnYQXfi.png",
        "https://imgur.com/EF6N11o.png",
        "https://imgur.com/Ckeq5ZN.png",
        "https://imgur.com/Q471QMS.png",
        "https://imgur.com/tbsjFRg.png",
        "https://imgur.com/aRyGKQn.png"
      ],
      AfricaPhoto: [
        "https://imgur.com/GWczpqr.png",
        "https://imgur.com/YcKUIDi.png",
        "https://imgur.com/iAXAquL.png",
        "https://imgur.com/APdq0O3.png",
        "https://imgur.com/Bp53saw.png",

        "https://imgur.com/S0gveon.png",
        "https://imgur.com/PDcUlGP.png",
        "https://imgur.com/pE7u04W.png",
        "https://imgur.com/Wl09Lsd.png",
        "https://imgur.com/tOOmmUr.png",
        "https://imgur.com/104skcm.png"
      ],
      AustraliaPhoto: [
        "https://imgur.com/xl4llf2.png",
        "https://imgur.com/qRPxV4z.png",
        "https://imgur.com/TdohvFG.png",
        "https://imgur.com/CJT8IwN.png",
        "https://imgur.com/6TFUJ81.png",

        "https://imgur.com/XQ9KECT.png",
        "https://imgur.com/XQyRydP.png",
        "https://imgur.com/KTjLpaO.png",
        "https://imgur.com/VjkzSgE.png",
        "https://imgur.com/dX1VqiB.png",
        "https://imgur.com/GkHI8Rs.png",
        "https://imgur.com/GV8ebhP.png"
      ],
      BestPicture: [],
      guideBooks: [],
      items: [
        {
          src:
            "https://www.telegraph.co.uk/content/dam/Travel/2018/September/Frankfurt-christmas-market-iStock-520625727.jpg?imwidth=1400",
          href:
            "https://www.google.co.kr/travel/guide?dest_mid=%2Fm%2F09b83&dest_src=yts&hl=ko&gl=kr&g2lb=2502405%2C2502548%2C4208993%2C4254308%2C4258168%2C4260007%2C4270442%2C4274032%2C4285990%2C4289525%2C4291318%2C4301054%2C4305595%2C4308216%2C4308227%2C4313006%2C4314846%2C4315873%2C4317816%2C4317915%2C4322339%2C4324289%2C4326405%2C4326764%2C4328159%2C4329288%2C4329496%2C4333189%2C4270859%2C4284970%2C4291517%2C4292955%2C4307997%2C4333108#dest_mid=/m/09b83&dest_src=yts&tcfs=Eh4KCC9tLzA5YjgzEhLsiqTtirjrnbzsiqTrtoDrpbQ",
          weather:
            "https://www.msn.com/ko-kr/weather/today/%ec%8a%a4%ed%8a%b8%eb%9d%bc%ec%8a%a4%eb%b6%80%eb%a5%b4grand-est%ed%94%84%eb%9e%91%ec%8a%a4/we-city?q=%ec%8a%a4%ed%8a%b8%eb%9d%bc%ec%8a%a4%eb%b6%80%eb%a5%b4-grand-est&form=PRWLAS&iso=FR&el=lwGF4%2fBEZec1foLxEZ%2bH2w%3d%3d"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2014/06/06/09/36/sydney-363244_1280.jpg",
          href:
            "https://www.google.co.kr/travel/guide?dest_mid=%2Fm%2F06y57&dest_src=yts&hl=ko&gl=kr&g2lb=2502405%2C2502548%2C4208993%2C4254308%2C4258168%2C4260007%2C4270442%2C4274032%2C4285990%2C4289525%2C4291318%2C4301054%2C4305595%2C4308216%2C4308227%2C4313006%2C4314846%2C4315873%2C4317816%2C4317915%2C4322339%2C4324289%2C4326405%2C4326764%2C4328159%2C4329288%2C4329496%2C4333189%2C4270859%2C4284970%2C4291517%2C4292955%2C4307997%2C4333108#dest_mid=/m/06y57&dest_src=yts&tcfs=EhUKCC9tLzA2eTU3Egnsi5zrk5zri4g",
          weather:
            "https://www.msn.com/ko-kr/weather/today/%ec%8b%9c%eb%93%9c%eb%8b%88%eb%89%b4%ec%82%ac%ec%9a%b0%ec%8a%a4%ec%9b%a8%ec%9d%bc%ec%8a%a4%ec%98%a4%ec%8a%a4%ed%8a%b8%eb%a0%88%ec%9d%bc%eb%a6%ac%ec%95%84/we-city?q=%ec%8b%9c%eb%93%9c%eb%8b%88-%eb%89%b4%ec%82%ac%ec%9a%b0%ec%8a%a4%ec%9b%a8%ec%9d%bc%ec%8a%a4&form=PRWLAS&iso=AU&el=b%2b2RhOLtTIzmYF%2bLSO7I6g%3d%3d"
        },
        {
          src:
            "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
          href:
            "https://www.google.co.kr/destination?q=%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C&output=search&dest_mid=/m/03rj0&sa=X&ved=2ahUKEwiZivHk04TmAhVU-WEKHWANBjIQri4wJ3oECAwQAw",
          weather:
            "https://www.msn.com/ko-kr/weather/today/%eb%a0%88%ec%9d%b4%ec%ba%ac%eb%b9%84%ed%81%ac%ed%9a%8c%eb%b7%94%eb%93%9c%eb%b3%b4%eb%a5%b4%ea%b0%80%eb%a5%b4%ec%8a%a4%eb%b0%94%ec%9d%b4%eb%94%94%ec%95%84%ec%9d%b4%ec%8a%ac%eb%9e%80%eb%93%9c/we-city?q=%eb%a0%88%ec%9d%b4%ec%ba%ac%eb%b9%84%ed%81%ac-%ed%9a%8c%eb%b7%94%eb%93%9c%eb%b3%b4%eb%a5%b4%ea%b0%80%eb%a5%b4%ec%8a%a4%eb%b0%94%ec%9d%b4%eb%94%94&form=PRWLAS&iso=IS&el=Npgc7J6ROrP%2f%2bGGrcoSVXA%3d%3d"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2015/03/11/12/31/new-york-668616_1280.jpg",
          href:
            "https://www.google.co.kr/travel/guide?dest_mid=%2Fm%2F02_286&dest_src=yts&hl=ko&gl=kr&g2lb=2502405%2C2502548%2C4208993%2C4254308%2C4258168%2C4260007%2C4270442%2C4274032%2C4285990%2C4289525%2C4291318%2C4301054%2C4305595%2C4308216%2C4308227%2C4313006%2C4314846%2C4315873%2C4317816%2C4317915%2C4322339%2C4324289%2C4326405%2C4326764%2C4328159%2C4329288%2C4329496%2C4333189%2C4270859%2C4284970%2C4291517%2C4292955%2C4307997%2C4333108#dest_mid=/m/02_286&dest_src=yts&tcfs=EhMKCS9tLzAyXzI4NhIG64m07JqV",
          weather:
            "https://www.msn.com/ko-kr/weather/today/%eb%89%b4%ec%9a%95%eb%89%b4%ec%9a%95%eb%af%b8%ea%b5%ad/we-city?q=%eb%89%b4%ec%9a%95&form=PRWLAS&iso=US&el=J4NoQdCzGdFgve0M8iFSeQ%3d%3d"
        },
        {
          src:
            "https://cdn.pixabay.com/photo/2017/05/10/18/16/pyramid-2301471_1280.jpg",
          href:
            "https://www.google.co.kr/travel/guide?q=%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C&sa=X&output=search&tra=%5B%22AMAbHIIqRuVGEdmRRk-chWfLbZatyOSylA:1574660839472%22,%22%EC%9D%B4%EC%A7%91%ED%8A%B8%22,%22/m/03rj0%22%5D&tcfs=EhsKCC9tLzAzcmowEg_slYTsnbTsiqzrnoDrk5w&dest_mid=/m/02k54#dest_mid=/m/02k54&tcfs=EhUKCC9tLzAyazU0EgnsnbTsp5Htirg",
          weather:
            "https://www.msn.com/ko-kr/weather/today/%ec%b9%b4%ec%9d%b4%eb%a1%9c%ec%b9%b4%ec%9d%b4%eb%a1%9c%ec%9d%b4%ec%a7%91%ed%8a%b8/we-city?q=%ec%b9%b4%ec%9d%b4%eb%a1%9c&form=PRWLAS&iso=EG&el=YrKew6MsQczXdwP97Qu%2beQ%3d%3d"
        }
      ]
    };
  },
  components: {},
  methods: {
    click(i) {
      window.open(this.items[i].href, "_blank");
    },
    click1(i) {
      window.open(this.items[i].weather, "_blank");
    },
    readBest(itm) {
      sessionStorage.setItem("items", JSON.stringify(itm));
      this.$router.push("ReadBoardPage");
    },
    getFirstImg(obj) {
      var doc = document.implementation.createHTMLDocument().body;
      doc.innerHTML = obj.content;

      const pattern = /(http(s)?:\/\/i\.imgur\.com\/)[a-zA-Z0-9]*\.(jpg)?(png)?/gi;

      if (
        doc.querySelector("img") == null &&
        doc.innerHTML.match(pattern) == null
      ) {
        var randomNumber = -1;
        var photo = [];
        switch (obj.category) {
          case "Asia":
            console.log("Asia");
            randomNumber = Math.floor(Math.random() * this.AsiaPhoto.length); //0 ~ 4,3,2,1,0
            return this.AsiaPhoto[randomNumber];
          case "Europe":
            console.log("Europe");
            randomNumber = Math.floor(Math.random() * this.EuropePhoto.length);
            return this.EuropePhoto[randomNumber];
          case "NorthAmerica":
            console.log("NA");
            randomNumber = Math.floor(
              Math.random() * this.NorthAmericaPhoto.length
            );
            return this.NorthAmericaPhoto[randomNumber];
          case "SouthAmerica":
            console.log("SA");
            randomNumber = Math.floor(
              Math.random() * this.SouthAmericaPhoto.length
            );
            return this.SouthAmericaPhoto[randomNumber];
          case "Australia":
            console.log("Au");
            randomNumber = Math.floor(
              Math.random() * this.AustraliaPhoto.length
            );
            return this.AustraliaPhoto[randomNumber];
          case "Africa":
            console.log("Af");
            randomNumber = Math.floor(Math.random() * this.AfricaPhoto.length);
            return this.AfricaPhoto[randomNumber];
        }
      } else if (doc.innerHTML.match(pattern) == null) {
        return doc.querySelector("img").getAttribute("src");
      } else {
        console.log(doc.innerHTML.match(pattern));
        return doc.innerHTML.match(pattern)[0];
      }
    }
  }
};
</script>
<style scoped>
.grid12-6 {
  position: relative;
}
.grid12-6 .inner_box {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  left: 10%;
  margin-top: 5%;
  transform: translate(-30%, -30%);
  padding: 40px; /*  사이즈조절 */
  text-align: center;
}
.grid12-6 .inner_box1 {
  position: absolute;

  background: rgba(255, 255, 255, 0.3);

  right: 10%;
  margin-top: 25%;
  padding: 20px; /*  사이즈조절 */
  text-align: center;
}

.grid12-6 .inner_box h2 {
  font-family: arial;
  text-align: center;
  font-size: 20px;
  font-weight: bolder;
}
.h3 {
  font-family: arial;
  text-align: center;
  font-size: 20px;
  font-weight: normal;
}
</style>
