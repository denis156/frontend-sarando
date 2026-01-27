import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/Blog.vue'),
        },
        {
          path: 'proyek',
          name: 'proyek',
          component: () => import('@/views/Proyek.vue'),
        },
{
          path: 'layanan',
          name: 'layanan',
          component: () => import('@/views/Layanan.vue'),
        },
        {
          path: 'kontak',
          name: 'kontak',
          component: () => import('@/views/Kontak.vue'),
        },
      ],
    },
  ],
})

export default router
