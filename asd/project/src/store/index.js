import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GuideBook: {
      num: "",
      email: "",
      title: "",
      content: "",
      date: "",
      file: "",
      docid: ""
    },
    Board: {
      num: "",
      title: "",
      content: "",
      writer: "",
      date: "",
      view: "",
      numOfComments: "",
      filenames: "",
      category: "",
      docid: ""
    },
    deleteData: [],
    isLoginState: localStorage.getItem("email"),
    drawer: false,
    numOfCommentsVuex: 0
  },
  mutations: {
    numOfCommentsChange: (state, payload) => {
      state.numOfCommentsVuex = payload
    },
    resetMyStore: state => {
      state.GuideBook.num = "";
      state.GuideBook.email = "";
      state.GuideBook.title = "";
      state.GuideBook.content = "";
      state.GuideBook.date = new Date().toISOString().substring(0, 10);
      state.GuideBook.views = "";
      state.GuideBook.comments = "";
      state.GuideBook.file = "";
      state.GuideBook.docid = "";
    },
    readMyGuideBook: (state, payload) => {
      state.GuideBook.num = payload.num;
      state.GuideBook.email = payload.email;
      state.GuideBook.title = payload.title;
      state.GuideBook.content = payload.content;
      state.GuideBook.date = payload.date;
      state.GuideBook.file = payload.file;
      state.GuideBook.docid = payload.docid;
    },
    readBoard: (state, payload) => {
      state.Board.num = payload.num;
      state.Board.writer = payload.writer;
      state.Board.title = payload.title;
      state.Board.content = payload.content;
      state.Board.date = payload.date;
      state.Board.view = payload.view;
      state.Board.numOfComments = payload.numOfComments;
      state.Board.filenames = payload.filenames;
      state.Board.category = payload.category;
      state.Board.docid = payload.docid;
    },
    deleteData: (state, payload) => {
      state.deleteData = payload;
    },
    drawerChange: (state, payload) => {
      state.drawer = !state.drawer;
    }
  },
  getters: {
    getMyGuideBook: state => {
      return state.GuideBook;
    },
    getBoard: state => {
      return state.Board;
    },
    getDeleteData: state => {
      return state.deleteData;
    },
    getIsLoginState: state => {
      return state.isLoginState;
    },
    getDrawer: state => {
      return state.drawer;
    },
    getNumOfComments: state => {
      return state.numOfCommentsVuex
    }
  },
  actions: {},
  modules: {}
});