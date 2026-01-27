export type TechnologyCategory = 'backend' | 'frontend' | 'database' | 'devops' | 'mobile' | 'other'

export interface Technology {
  id: number
  name: string
  slug: string
  icon: string | null
  category: TechnologyCategory
}
