import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
})

// 路由守衛：沒有 token 就跳轉到登入頁
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  // 沒有 token 且不是去登入或註冊頁
  if (!token && to.name !== 'login' && to.name !== 'register') {
    return { name: 'login' }
  }

  // 有 token 但去登入或註冊頁，跳轉到首頁
  if (token && (to.name === 'login' || to.name === 'register')) {
    return { name: 'home' }
  }
})

export default router
