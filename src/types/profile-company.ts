export interface ProfileCompany {
  id: number
  company_name: string
  company_legal_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  tax_id: string | null
  logo_path: string | null
  website: string | null
  default_account_id: number | null
  is_active: boolean
}
