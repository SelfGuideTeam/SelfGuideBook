import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import ReadBoardPage from "../views/Forum/ReadBoardPage.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "first",
    component: Main
  },
  {
    path: "/main",
    name: "main",
    component: Main
  },
  {
    path: "/contactUs",
    name: "contactUs",
    component: () => import("../views/ContactUs.vue")
  },
  {
    path: "/guideline",
    name: "guideline",
    component: () => import("../views/Guideline.vue")
  },
  {
    path: "/myPage",
    name: "myPage",
    component: () => import("../views/MyPage/MyPage.vue")
  },
  {
    path: "/readMyGuideBook",
    name: "readMyGuideBook",
    component: () => import("../views/MyPage/ReadMyGuideBook.vue")
  },
  {
    path: "/writeMyGuideBook",
    name: "writeMyGuideBook",
    component: () => import("../views/MyPage/WriteMyGuideBook.vue")
  }, {
    path: "/modifyMyGuideBook",
    name: "modifyMyGuideBook",
    component: () => import("../views/MyPage/ModifyMyGuideBook.vue")
  },
  {
    path: "/MyGuideBookPage",
    name: "MyGuideBookPage",
    component: () => import("../views/MyPage/MyGuideBookPage.vue")
  }, {
    path: "/BoardPage",
    name: "BoardPage",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_Asia",
    name: "BoardPage_Asia",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_Europe",
    name: "BoardPage_Europe",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_NorthAmerica",
    name: "BoardPage_NorthAmerica",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_SouthAmerica",
    name: "BoardPage_SouthAmerica",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_Africa",
    name: "BoardPage_SouthAmerica",
    component: () => import("../views/Forum/BoardPage.vue")
  }, {
    path: "/BoardPage_Australia",
    name: "BoardPage_Australia",
    component: () => import("../views/Forum/BoardPage.vue")
  },
  {
    path: "/ReadBoardPage",
    name: "ReadBoardPage",
    component: ReadBoardPage
  },
  {
    path: "/WriteBoardPage",
    name: "WriteBoardPage",
    component: () => import("../views/Forum/WriteBoardPage.vue")
  },
  {
    path: "/UpdateBoardPage",
    name: "UpdateBoardPage",
    component: () => import("../views/Forum/UpdateBoardPage.vue")
  },
  {
    path: "/comments",
    name: "comments",
    component: () => import("../views/Forum/comments.vue")
  }, {
    path: "/rewriteComment",
    name: "rewriteComment",
    component: () => import("../views/Forum/rewriteComment.vue")
  }, {
    path: "/deleteComment",
    name: "deleteComment",
    component: () => import("../views/Forum/deleteComment.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;