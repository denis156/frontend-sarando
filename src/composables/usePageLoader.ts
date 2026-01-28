import { ref } from 'vue'

const isLoading = ref(false)

export function usePageLoader() {
  const startLoading = () => {
    isLoading.value = true
  }

  const finishLoading = () => {
    // Optional: Add a small delay to ensure smooth exit animation or wait for next tick
    // For now, we'll let the component handle the exit animation logic based on this state change
    setTimeout(() => {
      isLoading.value = false
    }, 500) // Minimum display time or delay
  }

  return {
    isLoading,
    startLoading,
    finishLoading,
  }
}
