import apiClient from './axios'
import type { Project } from '@/types/project'

export async function getProjects(): Promise<Project[]> {
  const response = await apiClient.get<{ data: Project[] }>('/projects')
  return response.data.data
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const response = await apiClient.get<{ data: Project }>(`/projects/${slug}`)
  return response.data.data
}
