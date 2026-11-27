const amount = new Intl.NumberFormat('fi-FI', {minimumFractionDigits: 2, maximumFractionDigits: 2})

export function formatPrice(value: number | null | undefined): string | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? `€${amount.format(value)}` : undefined
}
