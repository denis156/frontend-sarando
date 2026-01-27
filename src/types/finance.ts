export type IncomeSource = 'payment' | 'consulting' | 'maintenance' | 'training' | 'other'

export type ExpenseCategory = 'payroll' | 'operational' | 'marketing' | 'project_cost' | 'other'

export interface Income {
  id: number
  income_date: string
  amount: string
  source: IncomeSource
  payment_id: number | null
  project_id: number | null
  account_id: number
  received_from: string
  description: string | null
  notes: string | null
}

export interface Expense {
  id: number
  expense_date: string
  amount: string
  category: ExpenseCategory
  project_id: number | null
  account_id: number
  vendor_name: string | null
  description: string
  receipt_path: string | null
  notes: string | null
}
