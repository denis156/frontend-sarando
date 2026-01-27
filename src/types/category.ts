export type CategoryType = 'service' | 'blog' | 'portfolio'

export interface Category {
  id: number
  type: CategoryType
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  order: number
}
