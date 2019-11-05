// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'


Vue.config.productionTip = false

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
