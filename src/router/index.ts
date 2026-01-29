import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Beranda from '@/views/Beranda.vue'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sarando'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'beranda',
          component: Beranda,
          meta: { title: 'Beranda' },
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/Blog.vue'),
          meta: { title: 'Blog' },
        },
        {
          path: 'proyek',
          name: 'proyek',
          component: () => import('@/views/Proyek.vue'),
          meta: { title: 'Proyek' },
        },
        {
          path: 'layanan',
          name: 'layanan',
          component: () => import('@/views/Layanan.vue'),
          meta: { title: 'Layanan' },
        },
        {
          path: 'layanan/:slug',
          name: 'detail-layanan',
          component: () => import('@/views/DetailLayanan.vue'),
          meta: { title: 'Detail Layanan' },
        },
        {
          path: 'kontak',
          name: 'kontak',
          component: () => import('@/views/Kontak.vue'),
          meta: { title: 'Kontak' },
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

router.afterEach((to) => {
  const { finishLoading } = usePageLoader()

  // Update document title
  const pageTitle = to.meta.title as string | undefined
  document.title = pageTitle ? `${pageTitle} - ${APP_NAME}` : APP_NAME

  // Add a small delay to simulate loading or ensure entering animation plays
  setTimeout(() => {
    finishLoading()
  }, 800)
})

export default router
