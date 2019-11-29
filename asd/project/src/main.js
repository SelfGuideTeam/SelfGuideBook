import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";

// export const EventBus = new Vue();
// export default EventBus;

Vue.prototype.$EventBus = new Vue();
Vue.prototype.$http = axios;
Vue.prototype.$firebase = firebase;

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyAsuqJ-7DH6YCl3zoi90u7DqsD6vIL_PV0",
  authDomain: "fir-ex-63c1a.firebaseapp.com",
  databaseURL: "https://fir-ex-63c1a.firebaseio.com",
  projectId: "fir-ex-63c1a",
  storageBucket: "fir-ex-63c1a.appspot.com",
  messagingSenderId: "912304737763",
  appId: "1:912304737763:web:fa199b4e434c11b27864d6",
  measurementId: "G-6P274N0X3F"
};
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");