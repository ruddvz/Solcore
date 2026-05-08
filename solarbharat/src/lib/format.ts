export function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    Math.round(n),
  )
}

export function formatCr(n: number): string {
  const cr = n / 1e7
  if (cr >= 1 || cr <= -1) return `${cr.toFixed(2)} Cr`
  const l = n / 1e5
  return `${l.toFixed(2)} L`
}

export function formatUnitsLakh(n: number): string {
  return `${n.toFixed(2)} Lakh units`
}

/** Cash in ₹ lakh (1L = ₹1,00,000) — Plan0 disclosure style */
export function formatRsLakh(n: number): string {
  const lakhs = n / 1e5
  return `₹${lakhs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}L`
}
