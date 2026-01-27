import type { Client } from './client'
import type { Service } from './service'
import type { Technology } from './technology'

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid'

export interface ProjectImage {
  id: number
  project_id: number
  image_path: string
  title: string | null
  order: number
  is_thumbnail: boolean
}

export interface ProjectTask {
  id: number
  project_id: number
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  order: number
}

export interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  status: ProjectStatus
  client_id: number | null
  service_id: number | null
  project_url: string | null
  repository_url: string | null
  started_at: string | null
  completed_at: string | null
  price: string | null
  payment_status: PaymentStatus
  is_featured: boolean
  order: number
  client?: Client
  service?: Service
  images?: ProjectImage[]
  tasks?: ProjectTask[]
  technologies?: Technology[]
}
