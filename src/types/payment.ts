export type PaymentMethod = 'transfer' | 'cash' | 'e-wallet' | 'credit_card' | 'other'

export interface Payment {
  id: number
  invoice_id: number
  payment_date: string
  amount: string
  payment_method: PaymentMethod
  account_id: number
  reference_number: string | null
  notes: string | null
}
