import { ref, readonly, computed } from 'vue'
import { getAppearance } from '@/api/appearance'
import type { AppearanceSettings } from '@/types/appearance'

const appearance = ref<AppearanceSettings>({})
const isLoaded = ref(false)
const isLoading = ref(false)

// Helper: Convert key to readable label
// appearance_github_link -> GitHub
// appearance_instagram_link -> Instagram
function keyToLabel(key: string): string {
  return key
    .replace(/^appearance_/, '') // Remove prefix
    .replace(/_link$/, '') // Remove suffix
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function useAppearance() {
  async function fetchAppearance() {
    if (isLoaded.value || isLoading.value) return

    isLoading.value = true
    try {
      appearance.value = await getAppearance()
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch appearance settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Auto-detect social links (keys ending with _link)
  const socialLinks = computed(() => {
    return Object.entries(appearance.value)
      .filter(([key, value]) => key.endsWith('_link') && value)
      .map(([key, value]) => ({
        label: keyToLabel(key),
        link: value as string,
      }))
  })

  return {
    appearance: readonly(appearance),
    socialLinks,
    isLoaded: readonly(isLoaded),
    isLoading: readonly(isLoading),
    fetchAppearance,
  }
}
