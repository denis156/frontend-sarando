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

  // API configuration
  const API_URL = import.meta.env.VITE_BACKEND_APP_URL || 'https://sarando.site/api'
  const API_KEY = import.meta.env.VITE_BACKEND_APP_KEY || ''

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (API_KEY) {
    headers['X-API-KEY'] = API_KEY
  }

  const dynamicRoutes: string[] = []

  // Fetch services untuk dynamic routes
  try {
    const servicesResponse = await fetch(`${API_URL}/services`, { headers })

    if (servicesResponse.ok) {
      const servicesJson = await servicesResponse.json()
      const services = servicesJson.data || servicesJson

      if (Array.isArray(services)) {
        services.forEach((service: { slug: string }) => {
          dynamicRoutes.push(`/layanan/${service.slug}`)
        })
      }
    }
  } catch (error) {
    console.warn('[SSG] Failed to fetch services:', error)
  }

  // Fetch projects untuk dynamic routes
  try {
    const projectsResponse = await fetch(`${API_URL}/projects`, { headers })

    if (projectsResponse.ok) {
      const projectsJson = await projectsResponse.json()
      const projects = projectsJson.data || projectsJson

      if (Array.isArray(projects)) {
        projects.forEach((project: { slug: string }) => {
          dynamicRoutes.push(`/proyek/${project.slug}`)
        })
      }
    }
  } catch (error) {
    console.warn('[SSG] Failed to fetch projects:', error)
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes]
  console.log('[SSG] Pre-rendering routes:', allRoutes)
  return allRoutes
}
