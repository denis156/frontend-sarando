import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes, scrollBehavior } from './router'
import { usePageLoader } from './composables/usePageLoader'

import './styles/app.css'

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sarando'

// Export createApp untuk ViteSSG
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior,
  },
  ({ app, router, initialState, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)

    // Hydrate pinia state untuk SSG
    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
    } else if (initialState.pinia) {
      pinia.state.value = initialState.pinia
    }

    // Client-side only: Page loader dan title update
    if (isClient) {
      const { startLoading, finishLoading } = usePageLoader()

      router.beforeEach((to, from, next) => {
        if (to.path !== from.path) {
          startLoading()
        }
        next()
      })

      router.afterEach((to) => {
        // Update document title (untuk client-side navigation)
        const pageTitle = to.meta.title as string | undefined
        document.title = pageTitle ? `${pageTitle} - ${APP_NAME}` : APP_NAME

        setTimeout(() => {
          finishLoading()
        }, 800)
      })
    }
  },
)

// SSG: Define routes yang akan di-pre-render (termasuk dynamic routes)
export async function includedRoutes(
  paths: string[],
  routes: { path: string; name?: string }[],
): Promise<string[]> {
  // Static routes
  const staticRoutes = ['/', '/blog', '/proyek', '/layanan', '/kontak']

  // Fetch dynamic routes dari API
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'https://sarando.site/api'
    const response = await fetch(`${API_URL}/services`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const json = await response.json()

    // API response format: { data: Service[] }
    const services = json.data || json

    if (!Array.isArray(services)) {
      throw new Error('Invalid API response: expected array of services')
    }

    // Generate routes untuk setiap service slug
    const dynamicRoutes = services.map((service: { slug: string }) => `/layanan/${service.slug}`)

    console.log('[SSG] Pre-rendering routes:', [...staticRoutes, ...dynamicRoutes])
    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.warn('[SSG] Failed to fetch dynamic routes, using static only:', error)
    return staticRoutes
  }
}
