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

// Page Transition Loader Logic
import { usePageLoader } from '@/composables/usePageLoader'

router.beforeEach((to, from, next) => {
  const { startLoading } = usePageLoader()
  // Trigger loading only if moving to a different route
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
