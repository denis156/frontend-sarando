export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceItem {
  id: number
  invoice_id: number
  service_price_id: number | null
  name: string
  description: string | null
  quantity: number
  unit_price: string
  amount: string
  order: number
}

export interface Invoice {
  id: number
  project_id: number
  invoice_number: string
  issue_date: string
  due_date: string
  subtotal: string
  tax_percentage: string | null
  tax_amount: string
  discount_percentage: string | null
  discount_amount: string
  total: string
  status: InvoiceStatus
  notes: string | null
  items?: InvoiceItem[]
}
