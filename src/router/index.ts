import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Beranda from '@/views/Beranda.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'beranda', // Changed from 'home' to match file
          component: Beranda,
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
          path: 'layanan/:slug',
          name: 'detail-layanan',
          component: () => import('@/views/DetailLayanan.vue'),
        },
        {
          path: 'kontak',
          name: 'kontak',
          component: () => import('@/views/Kontak.vue'),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Page Transition Loader Logic
import { usePageLoader } from '@/composables/usePageLoader'

router.beforeEach((to, from, next) => {
  const { startLoading } = usePageLoader()
  // Trigger loading on route change
  if (to.path !== from.path) {
    startLoading()
  }
  next()
})

router.afterEach(() => {
  const { finishLoading } = usePageLoader()
  // Add a small delay to simulate loading or ensure entering animation plays
  setTimeout(() => {
    finishLoading()
  }, 800)
})

export default router
