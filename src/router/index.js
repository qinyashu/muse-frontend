import { createRouter, createWebHashHistory } from 'vue-router'

import AuthPage from '../views/AuthPage.vue'
import CreatePage from '../views/CreatePage.vue'
import HistoryPage from '../views/HistoryPage.vue'
import HomePage from '../views/HomePage.vue'
import LegalPage from '../views/LegalPage.vue'
import MemberPage from '../views/MemberPage.vue'
import MyPage from '../views/MyPage.vue'
import ServicePage from '../views/ServicePage.vue'
import TaskPage from '../views/TaskPage.vue'
import { isAuthed } from '../utils/auth'

// 使用 hash 路由，方便移动端网页和 Vercel 静态部署。
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: () => (isAuthed() ? '/home' : '/login'),
    },
    {
      path: '/login',
      name: 'login',
      component: AuthPage,
      meta: { guest: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/me',
      name: 'me',
      component: MyPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/member',
      name: 'member',
      component: MemberPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/service',
      name: 'service',
      component: ServicePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/legal/:type',
      name: 'legal',
      component: LegalPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/task/:id',
      name: 'task',
      component: TaskPage,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthed()) {
    return '/login'
  }

  if (to.meta.guest && isAuthed()) {
    return '/home'
  }

  return true
})

export default router
