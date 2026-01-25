import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk mendeteksi breakpoint layar
 * @param breakpoint - Breakpoint dalam pixel (default: 768 untuk md)
 * @returns isMobile - Reactive boolean apakah layar mobile atau tidak
 */
export function useBreakpoint(breakpoint: number = 768) {
  const isMobile = ref(false)

  const checkScreenSize = () => {
    isMobile.value = window.innerWidth < breakpoint
  }

  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })

  return {
    isMobile
  }
}
