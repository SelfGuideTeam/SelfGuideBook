import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GuideBook: {
      num: "",
      writer: "",
      title: "",
      content: "",
      date: "",
      filenames: "",
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
    Info: {
      title: "",
      content: "",
      file: []
    },
    deleteData: [],
    isLoginState: localStorage.getItem("email"),
    drawer: false,
    numOfCommentsVuex: 0
  },
  mutations: {
    Info: (state, payload) => {
      state.Info.title = payload.title
      state.Info.content = payload.content
      state.Info.file = payload.file
    },
    numOfCommentsChange: (state, payload) => {
      state.numOfCommentsVuex = payload
    },
    resetMyStore: state => {
      state.GuideBook.num = "";
      state.GuideBook.writer = "";
      state.GuideBook.title = "";
      state.GuideBook.content = "";
      state.GuideBook.date = new Date().toISOString().substring(0, 10);
      state.GuideBook.filenames = "";
      state.GuideBook.docid = "";
    },
    readMyGuideBook: (state, payload) => {
      state.GuideBook.num = payload.num;
      state.GuideBook.writer = payload.writer;
      state.GuideBook.title = payload.title;
      state.GuideBook.content = payload.content;
      state.GuideBook.date = payload.date;
      state.GuideBook.filenames = payload.filenames;
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
    getInfo: state => {
      return state.Info
    },
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