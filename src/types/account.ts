export type AccountType = 'bank' | 'cash' | 'e-wallet'

export interface Account {
  id: number
  account_name: string
  account_type: AccountType
  bank_name: string | null
  account_number: string | null
  account_holder: string | null
  initial_balance: string
  description: string | null
  is_active: boolean
}
