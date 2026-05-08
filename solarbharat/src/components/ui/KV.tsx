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
      ? 'text-sb-gold font-mono text-[22px] font-bold'
      : variant === 'warn'
        ? 'text-sb-orange font-mono text-[22px] font-bold'
        : 'text-white font-mono text-[22px] font-bold'
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
        {label}
      </span>
      <span className={valClass}>{value}</span>
    </div>
  )
}
