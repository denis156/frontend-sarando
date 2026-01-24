import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // Future routes:
    // {
    //   path: '/blog',
    //   name: 'blog',
    //   component: () => import('@/views/Blog.vue'),
    // },
    // {
    //   path: '/support',
    //   name: 'support',
    //   component: () => import('@/views/Support.vue'),
    // },
    // {
    //   path: '/contact',
    //   name: 'contact',
    //   component: () => import('@/views/Contact.vue'),
    // },
  ],
})

export default router
