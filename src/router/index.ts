import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue')
    },
    {
      path: '/toolbar',
      name: 'toolbar',
      component: () => import('../components/toolbar.vue')
    },
    {
      path: '/checkbox',
      name: 'checkbox',
      component: () => import('../components/checkbox.vue')
    }
  ]
})

export default router
