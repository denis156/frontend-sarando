export interface ServicePrice {
  id: number
  package_name: string
  price: string
  description: string | null
  features: string[] | null
  is_active: boolean
  order: number
}

export interface Service {
  id: number
  category_id: number
  category_name: string | null
  name: string
  slug: string
  description: string | null
  icon: string | null
  image_path: string | null
  is_active: boolean
  order: number
  prices: ServicePrice[]
}
