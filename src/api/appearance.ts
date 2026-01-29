import apiClient from './axios'
import type { AppearanceSettings } from '@/types/appearance'

interface AppearanceItem {
  key: string
  value: string | boolean | number | object
}

export async function getAppearance(): Promise<AppearanceSettings> {
  const response = await apiClient.get<{ data: AppearanceItem[] }>('/appearance')

  // Transform array of {key, value} to flat object
  return response.data.data.reduce(
    (acc, item) => {
      acc[item.key] = item.value as string
      return acc
    },
    {} as AppearanceSettings,
  )
}
