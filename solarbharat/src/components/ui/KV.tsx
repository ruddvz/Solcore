import type { ReactNode } from 'react'

export function KV({
  label,
  value,
  variant = 'normal',
}: {
  label: string
  value: ReactNode
  variant?: 'normal' | 'highlight' | 'warn'
}) {
  const valClass =
    variant === 'highlight'
      ? 'text-sb-gold font-mono text-lg font-extrabold'
      : variant === 'warn'
        ? 'text-sb-orange font-mono text-lg font-extrabold'
        : 'text-white font-mono text-base font-bold'
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">
        {label}
      </span>
      <span className={valClass}>{value}</span>
    </div>
  )
}
