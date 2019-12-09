<template>
  <div>
    <v-toolbar color="white">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-img
        src="https://imgur.com/Wh6l7xA.png"
        max-width="100"
        @click="mainPage()"
        v-if="$vuetify.breakpoint.lgAndUp"
        style="cursor: pointer"
      ></v-img>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- <v-btn text class="px-6" @click="loginForm()">Login</v-btn> -->
        <v-btn v-show="!isLogin" text class="px-6" @click.stop="loginForm()">Login</v-btn>
        <v-btn v-show="isLogin" text class="px-6" @click="logOut()">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <section>
      <v-parallax src="https://imgur.com/0FY1Mct.jpg" height="450"></v-parallax>
    </section>
    <v-toolbar v-if="$vuetify.breakpoint.lgAndUp" flat>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu text class="px-12" open-on-hover close-on-content-click offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" @click="boardPage()" class="px-12">
              <v-card color="transparent" flat>Board</v-card>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="setCategory(item.title)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn text class="px-12" @click="guideline()">
          <v-card color="transparent" flat>GuideLine</v-card>
        </v-btn>
        <v-btn
          text
          class="px-12"
          @click="guideEditorDownload()"
          @mouseover="textExtensionDownload()"
          @mouseout="textDownload()"
          v-html="extensionDownload"
          id="download"
        ></v-btn>
        <v-btn text class="px-12" @click="myPage()">
          <v-card color="transparent" flat>MyPage</v-card>
        </v-btn>
        <v-btn text class="px-12" @click="contactUsPage()">
          <v-card color="transparent" flat>Contact Us</v-card>
        </v-btn>
        <!-- <v-btn text class="px-12" @click="test">
          <v-card color="transparent" flat>test</v-card>
        </v-btn>-->
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-divider></v-divider>

    <v-dialog v-model="dialog" max-width="400">
      <v-card min-width="300" height="280" elevation="10" align="center" justify="center">
        <v-spacer class="pt-2"></v-spacer>
        <v-card-title class="display-1 font-regular justify-center pt-12">로그인</v-card-title>
        <v-spacer class="pt-12"></v-spacer>
        <v-btn v-show="true" width="250" color="primary" x-large @click="login">Google Login</v-btn>
        <v-btn
          v-show="false"
          class="mt-1"
          width="250"
          color="primary"
          x-large
          @click="logOut()"
        >LogOut</v-btn>
        <v-btn
          class="mt-1"
          width="250"
          color="primary"
          x-large
          v-show="false"
          @click="userInfo()"
        >UserInfo</v-btn>
        <v-btn
          class="mt-1"
          width="250"
          color="primary"
          x-large
          v-show="false"
          @click="axios2()"
        >axios</v-btn>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-img src="https://imgur.com/Wh6l7xA.png" @click="mainPage()" style="cursor: pointer"></v-img>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-group prepend-icon="mdi-view-list" no-action>
          <template v-slot:activator>
            <v-list-item-title @click="boardPage()">Board</v-list-item-title>
          </template>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            @click="setCategory(item.title)"
          >
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item v-for="item in drawrItems" :key="item.title" link @click="item.method">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
import Api2Pdf from "api2pdf";
export default {
  computed: {
    computedIsLogin() {
      return this.$store.getters.getIsLoginState == null ? false : true;
    }
  },
  watch: {
    watchIsLogin() {
      this.isLogin = this.$store.getters.getIsLoginState == null ? false : true;
    }
  },
  data() {
    return {
      qwer: [],
      extensionDownload: "Download",
      dialog: false,
      isLogin: false,
      items: [
        { title: "Asia" },
        { title: "Europe" },
        { title: "NorthAmerica" },
        { title: "SouthAmerica" },
        { title: "Africa" },
        { title: "Australia" }
      ],
      drawrItems: [
        { title: "GuideLine", icon: "mdi-compass", method: this.guideline },
        {
          title: "ExtensionDownload",
          icon: "mdi-download",
          method: this.guideEditorDownload
        },
        { title: "MyPage", icon: "mdi-account", method: this.myPage },
        {
          title: "Contact Us",
          icon: "mdi-contact-phone-outline",
          method: this.contactUsPage
        }
      ],
      drawer: null
    };
  },
  created() {
    if (localStorage.getItem("email") == null) {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }
  },
  methods: {
    test() {
      var endpoint = "https://v2018.api2pdf.com/chrome/html";
      var apikey = "4ca7ff53-eafa-425c-aed2-64a7fd1f5a87"; //replace this with your own from portal.api2pdf.com
      //다른 언어도 쓰려면 meta charset 명시
      var blank_pattern = /^\s+|\s+$/g;

      var payload = {
        html: "<meta charset='UTF-8'>" + "<p>AAAAAAA</p>",
        inlinePdf: false
      };

      var a2pClient = new Api2Pdf(apikey);
      a2pClient.wkhtmltopdfFromHtml("<p>Hello, World</p>").then(result => {
        console.log(result.pdf);
        this.qwer = result;

        var file = new File([result.pdf], "BBB.pdf", {
          type: "application/pdf"
        });
        console.log(file);

        // var file = new File([result], "AAA" + ".pdf");

        // const storageRef = this.$firebase.storage().ref();
        // const uploadTask = storageRef.child("AAA.pdf").put(result);
        // uploadTask.on(
        //   this.$firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        //   snapshot => {
        //     var progress =
        //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     switch (snapshot.state) {
        //       case this.$firebase.storage.TaskState.PAUSED: // or 'paused'
        //         break;
        //       case this.$firebase.storage.TaskState.RUNNING: // or 'running'
        //         break;
        //     }
        //   },
        //   error => {
        //     this.loading = false;
        //   },
        //   () => {
        //     uploadTask.snapshot.ref
        //       .getDownloadURL()
        //       .then(function(downloadURL) {
        //         console.log("File available at", downloadURL);
        //       });
        //     this.loading = false;
        //   }
        // );
      });
      var xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint);
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.setRequestHeader("Authorization", apikey);
      xhr.send(JSON.stringify(payload));

      // 데이터 수신이 완료되면 표시
      xhr.addEventListener("load", () => {
        var kk = JSON.parse(xhr.response);
        console.log(xhr.response);
        var blob = xhr.response;

        var file2 = new File([kk.pdf], "AAAA.pdf");
        this.qwer = file2;
        var file = new File([blob], "AAA" + ".pdf", {
          type: blob.type
        });
        this.qwer = file;
        console.log(file);

        var result = JSON.parse(xhr.responseText);
        console.log(result);
      });
    },
    setCategory(category) {
      sessionStorage.removeItem("MyBoardPage");
      sessionStorage.setItem("category", category);
      this.$router.push("BoardPage_" + category);
      this.drawer = false;
    },
    drawerChange() {
      this.$store.state.drawer = !this.$store.state.drawer;
    },
    textDownload() {
      this.extensionDownload = "Download";
    },
    textExtensionDownload() {
      this.extensionDownload = `Extension<br>DownLoad`;
    },
    loginForm() {
      if (localStorage.getItem("email") != null) {
        this.isLogin = true;
      } else {
        this.dialog = true;
      }
    },
    myPage() {
      if (localStorage.getItem("email") != null) {
        this.$router.push("myPage");
      } else {
        this.dialog = true;
      }
      this.drawer = false;
    },
    fileupload() {
      this.$router.push("FileUpload");
    },
    mainPage() {
      this.$router.push("main");
      this.drawer = false;
    },
    boardPage() {
      sessionStorage.removeItem("MyBoardPage");
      sessionStorage.removeItem("category");
      this.$router.push("BoardPage");
      this.drawer = false;
    },
    contactUsPage() {
      this.$router.push("contactUs");
      this.drawer = false;
    },
    guideline() {
      this.$router.push("guideline");
      this.drawer = false;
    },
    async login() {
      await this.loginUsingGoogle();
      await this.ManagerCheck();
    },
    loginUsingGoogle() {
      return new Promise(resolve => {
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope(
              "https://www.googleapis.com/auth/contacts.readonly"
            );
            return firebase
              .auth()
              .signInWithPopup(provider)
              .then(result => {
                this.dialog = false;
                this.isLogin = true;
                var user = firebase.auth().currentUser;
                localStorage.setItem("email", user.email);
                localStorage.setItem("uid", user.uid);
                localStorage.setItem("displayName", user.displayName);
                resolve();
              })
              .catch(error => {
                this.dialog = false;
              });
          });
      });
    },
    ManagerCheck() {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("Manager")
          .doc("Managers")
          .collection("Managerss")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              if (doc.id == firebase.auth().currentUser.email) {
                alert("관리자 로그인");
                localStorage.setItem("manager", 1);
              }
            });
          })
          .then(() => {
            resolve();
          });
      });
    },
    logOut() {
      if (localStorage.getItem("email") == null) {
        this.isLogin = false;
      } else {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.dialog = false;
            this.isLogin = false;
            localStorage.clear();
            alert("로그아웃 되었습니다");
            this.$router.push("Main");
          })
          .catch(error => {
            alert("로그아웃실패" + error);
            this.dialog = false;
          });
      }
    },
    userInfo() {
      var user = firebase.auth().currentUser;
      if (user) {
        alert(JSON.stringify(user));
        // uid, displayName, photoURL, email,
      } else {
        alert("로그인아님");
      }
      this.dialog = false;
    },
    // axios2() {
    //   axios.post("/logout").then(response => {
    //       alert("success!!" + response.data);
    //       console.log(response.data);

    //       this.dialog = false;
    //     })
    //     .catch(err => {
    //       alert("실패" + err);
    //       this.dialog = false;
    //     });
    //   this.$router.push("Manager");
    // },
    guideEditorDownload() {
      if (localStorage.getItem("email") == null) {
        alert("로그인을 해주세요");
        return;
      }
      window.open(
        "https://chrome.google.com/webstore/detail/travelbooks/lgcpblahkafiididodgbpfakejnipbib"
      );
      // const storageRef = firebase.storage().ref();
      // var starsRef = storageRef.child("extension.zip");

      // starsRef
      //   .getDownloadURL()
      //   .then(url => {
      //     var aTag = document.createElement("a");
      //     aTag.download = url;
      //     aTag.href = url;
      //     aTag.click();
      //   })
      //   .catch(function(error) {
      //     switch (error.code) {
      //       case "storage/object-not-found":
      //         break;
      //       case "storage/unauthorized":
      //         break;
      //       case "storage/canceled":
      //         break;
      //       case "storage/unknown":
      //         break;
      //     }
      //   });
      this.drawer = false;
    }
  }
};
</script>

<style></style>
