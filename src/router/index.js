import { createRouter, createWebHashHistory } from 'vue-router'

import CreatePage from '../views/CreatePage.vue'
import HistoryPage from '../views/HistoryPage.vue'
import HomePage from '../views/HomePage.vue'
import TaskPage from '../views/TaskPage.vue'

// 使用 hash 路由，方便移动端静态部署。
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePage,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
    },
    {
      path: '/task/:id',
      name: 'task',
      component: TaskPage,
      props: true,
    },
  ],
})

export default router
