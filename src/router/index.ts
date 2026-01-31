import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Beranda from '@/views/Beranda.vue'

// SEO Meta Types
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    ogImage?: string
  }
}

// Export routes sebagai array untuk ViteSSG
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'beranda',
        component: Beranda,
        meta: {
          title: 'Beranda',
          description:
            'Sarando - Sarana Digital Anandonia. Adat yang bertemu teknologi. Merakit solusi digital berstandar global dengan jiwa kearifan lokal dari Konawe, Sulawesi Tenggara.',
        },
      },
      {
        path: 'blog',
        name: 'blog',
        component: () => import('@/views/Blog.vue'),
        meta: {
          title: 'Blog & Wawasan',
          description:
            'Artikel dan cerita inspiratif seputar teknologi, bisnis digital, dan kearifan lokal dari tim Sarando.',
        },
      },
      {
        path: 'proyek',
        name: 'proyek',
        component: () => import('@/views/Proyek.vue'),
        meta: {
          title: 'Proyek Kami',
          description:
            'Koleksi karya dan portofolio terbaik dari Sarando. Solusi digital yang telah kami bangun untuk berbagai klien.',
        },
      },
      {
        path: 'proyek/:slug',
        name: 'detail-proyek',
        component: () => import('@/views/DetailProyek.vue'),
        meta: {
          title: 'Detail Proyek',
        },
      },
      {
        path: 'layanan',
        name: 'layanan',
        component: () => import('@/views/Layanan.vue'),
        meta: {
          title: 'Layanan',
          description:
            'Layanan pengembangan website, aplikasi mobile, dan sistem digital dari Sarando. Solusi teknologi untuk bisnis Anda.',
        },
      },
      {
        path: 'layanan/:slug',
        name: 'detail-layanan',
        component: () => import('@/views/DetailLayanan.vue'),
        meta: {
          title: 'Detail Layanan',
          // Meta dinamis akan di-set oleh component dengan useSeoMeta
        },
      },
      {
        path: 'kontak',
        name: 'kontak',
        component: () => import('@/views/Kontak.vue'),
        meta: {
          title: 'Hubungi Kami',
          description:
            'Hubungi tim Sarando untuk konsultasi gratis tentang kebutuhan digital bisnis Anda. Kami siap membantu dari Konawe, Sulawesi Tenggara.',
        },
      },
    ],
  },
]

// Scroll behavior untuk router
export const scrollBehavior = (
  to: { hash: string },
  from: unknown,
  savedPosition: { left: number; top: number } | null,
) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { top: 0, behavior: 'smooth' as const }
  }
}
