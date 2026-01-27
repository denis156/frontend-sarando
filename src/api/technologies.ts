import apiClient from './axios'
import type { Technology } from '@/types/technology'

export async function getTechnologies(): Promise<Technology[]> {
  const response = await apiClient.get<{ data: Technology[] }>('/technologies')
  return response.data.data
}
