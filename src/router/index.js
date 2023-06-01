import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    // component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
    component: () => import(/* webpackChunkName: "Login" */ '@/views/LoginCopy.vue')
    // 路由独享守卫
    // beforeEnter (to, from, next) {
    //   if (getToken()?.length > 0) {
    //     // next(false)
    //     // 问题: 你手动修改url路由路径, next(false)会给你跳转回form页面
    //     // 产生一次历史记录, 导致你的返回按钮, $router.back()失效
    //     // 返回登录页, 回不去

    //     // 解决:
    //     // 1. 想要进登录页不留在原地了, 而是返回首页
    //     next('/layout/home')
    //     // 2. 移动端App也没有地址栏, 不必特别纠结返回按钮
    //   } else {
    //     next() // 其他情况通通放行
    //   }
    // }
  },
  // 阅读器
  {
    path: '/ebook',
    name: 'ebook',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('@/components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/store/index.vue'),
    redirect: '/store/shelf',
    children: [
      {
        path: 'shelf',
        component: () => import('../views/store/StoreShelf.vue'),
        meta: { showTab: false }
      },
      {
        path: 'category',
        component: () => import('../views/store/StoreCategory.vue'),
        meta: { showTab: false }
      },
      {
        path: 'home',
        component: () => import('../views/store/StoreHome.vue'),
        meta: { showTab: true }
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList.vue'),
        meta: { showTab: true }
      },
      {
        path: 'detail',
        component: () => import('../views/store/StoreDetail.vue'),
        meta: { showTab: false }
      },
      {
        path: 'speaking',
        component: () => import('../views/store/StoreSpeaking.vue'),
        meta: { showTab: false }
      },
      // 我的
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/user/index.vue'),
        meta: { showTab: true }
      }
    ]
  },
  { // 用户编辑页面
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/user/UserEdit')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/user/chat.vue')
  }

]

const router = new VueRouter({
  routes
})

export default router
