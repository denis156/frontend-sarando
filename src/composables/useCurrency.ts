export function useCurrency() {
  /**
   * Formats a number or string into Indonesian Rupiah (IDR) format.
   * Example: 30000000 -> "Rp 30.000.000"
   * Handles decimal strings like "30000000.00" by parsing them first.
   */
  const formatRupiah = (value: number | string): string => {
    if (value === null || value === undefined) return ''

    // Convert string to number (handle cases like "3000.00")
    const numericValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numericValue)) return String(value)

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue)
  }

  return {
    formatRupiah,
  }
}
