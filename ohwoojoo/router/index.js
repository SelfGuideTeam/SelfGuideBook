import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 홈 화면
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // 게시판 페이지 (리스트)
  {
    path: '/board-page',
    name: 'Board',
    component: () => import('../views/BoardPage.vue')
  },
  // 게시글 작성 페이지
  {
    path: '/write-board-page',
    name: 'writeBoard',
    component: () => import('../views/WriteBoardPage')
  },

  /// //////////////////////////////////////////////////////
  /// //////////////////////////////////////////////////////
  // 게시글 읽기 -> 수정, 삭제
  {
    path: `/read-board-page/:id`,
    name: 'readBoard',
    component: () => import('../views/ReadBoardPage')
  },
  /// //////////////////////////////////////////////////////
  /// //////////////////////////////////////////////////////
  // 인증
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('../views/SignIn')
  },
  // 사이드바
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about')
  },
  // test 페이지
  {
    path: '/example',
    component: () => import('../views/example')
  },
  // axios test 페이지
  {
    path: '/axios',
    component: () => import('../views/axios')
  },
  {
    path: '/mother',
    component: () => import('../views/mother')
  },
  {
    path: '/vuex',
    component: () => import('../views/vuex')
  },
  // 그 외 페이지
  {
    path: '/*',
    component: () => import('../views/e404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
