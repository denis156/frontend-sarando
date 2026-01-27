import { ref, onMounted } from 'vue'

/**
 * Composable untuk preload gambar
 * @param imageSrc - URL gambar yang akan di-preload
 * @returns isLoaded - Reactive boolean apakah gambar sudah loaded
 */
export function useImagePreload(imageSrc: string) {
  const isLoaded = ref(false)

  const preload = () => {
    // Add preload hint to browser
    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = imageSrc
    document.head.appendChild(preloadLink)

    // Preload image
    const img = new Image()
    img.onload = () => {
      isLoaded.value = true
    }
    img.onerror = () => {
      // Even if error, set to true to prevent blocking
      isLoaded.value = true
    }
    img.src = imageSrc
  }

  onMounted(() => {
    preload()
  })

  return {
    isLoaded,
  }
}
