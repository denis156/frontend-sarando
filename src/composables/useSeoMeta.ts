import { useHead } from '@unhead/vue'
import { computed, type MaybeRef, unref } from 'vue'

interface SeoMetaOptions {
  title: MaybeRef<string>
  description?: MaybeRef<string | null | undefined>
  image?: MaybeRef<string | null | undefined>
  url?: MaybeRef<string>
  type?: 'website' | 'article' | 'product'
}

const SITE_NAME = 'Sarando'
const SITE_URL = 'https://sarando.site'
const DEFAULT_DESCRIPTION =
  'Sarana Digital Anandonia - Solusi digital berstandar global dengan jiwa kearifan lokal dari Konawe, Sulawesi Tenggara.'
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`

/**
 * Composable untuk mengelola SEO meta tags
 *
 * @example
 * // Static usage
 * useSeoMeta({
 *   title: 'Beranda',
 *   description: 'Welcome to our website',
 * })
 *
 * @example
 * // Dynamic usage with refs
 * const title = computed(() => service.value?.name || 'Layanan')
 * useSeoMeta({
 *   title,
 *   description: computed(() => service.value?.description),
 * })
 */
export function useSeoMeta(options: SeoMetaOptions) {
  const fullTitle = computed(() => {
    const title = unref(options.title)
    return title ? `${title} - ${SITE_NAME}` : SITE_NAME
  })

  const description = computed(() => {
    const desc = unref(options.description)
    return desc || DEFAULT_DESCRIPTION
  })

  const image = computed(() => {
    const img = unref(options.image)
    if (!img) return DEFAULT_IMAGE
    // Handle relative paths
    if (img.startsWith('/')) return `${SITE_URL}${img}`
    if (img.startsWith('http')) return img
    return `${SITE_URL}/${img}`
  })

  const url = computed(() => unref(options.url) || SITE_URL)
  const type = options.type || 'website'

  useHead({
    title: fullTitle,
    meta: [
      // Basic Meta
      { name: 'description', content: description },

      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'id_ID' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
}

