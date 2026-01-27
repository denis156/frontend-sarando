import apiClient from './axios'
import type { Service } from '@/types/service'

export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<{ data: Service[] }>('/services')
  return response.data.data
}

export async function getFeaturedServices(): Promise<Service[]> {
  const response = await apiClient.get<{ data: Service[] }>('/services/featured')
  return response.data.data
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const response = await apiClient.get<{ data: Service }>(`/services/${slug}`)
  return response.data.data
}
