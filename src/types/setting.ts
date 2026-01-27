export interface Setting {
  id: number
  key: string
  title: string
  value: string | null
  type: string
  group: string | null
  description: string | null
}
