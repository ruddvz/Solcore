import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  accent = 'gold',
}: {
  children: ReactNode
  className?: string
  accent?: 'gold' | 'green' | 'blue'
}) {
  const border =
    accent === 'green'
      ? 'border-l-sb-green'
      : accent === 'blue'
        ? 'border-l-sb-blue'
        : 'border-l-sb-gold'
  return (
    <div
      className={`rounded-xl border border-white/10 bg-sb-surface/90 p-4 shadow-lg shadow-black/20 border-l-4 ${border} ${className}`}
    >
      {children}
    </div>
  )
}
