import type { ReactNode } from 'react'

const variants = {
  default: 'bg-sb-surface border-sb-line shadow-sb-sm',
  raised: 'bg-sb-card-strong border-sb-line shadow-sb-md',
  solar: 'bg-sb-goldFaint border-sb-gold/30 shadow-sb-sm',
  green: 'bg-sb-greenMuted border-sb-green/25 shadow-sb-sm',
  warning: 'bg-sb-orangeSoft border-sb-orange/25 shadow-sb-sm',
  danger: 'bg-sb-redSoft border-sb-red/25 shadow-sb-sm',
  flat: 'bg-sb-surface-muted border-sb-line shadow-none',
  interactive:
    'bg-sb-card-strong border-sb-line shadow-sb-sm transition active:scale-[0.99] hover:border-sb-lineStrong focus-within:ring-2 focus-within:ring-sb-gold/40',
} as const

export function AppCard({
  children,
  className = '',
  variant = 'default',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  variant?: keyof typeof variants
  as?: 'div' | 'section' | 'article'
}) {
  return (
    <Tag
      className={`rounded-sb-xl border p-4 md:p-5 ${variants[variant]} ${className}`}
    >
      {children}
    </Tag>
  )
}
