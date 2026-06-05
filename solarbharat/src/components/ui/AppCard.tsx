import type { ReactNode } from 'react'

const variants = {
  default: 'bg-[var(--sb-card)] border-[var(--sb-line)] shadow-[0_8px_28px_rgba(39,31,15,0.08)]',
  raised: 'bg-sb-card-strong border-[var(--sb-line)] shadow-sb-md',
  solar: 'bg-sb-goldFaint border-sb-gold/30 shadow-sb-sm',
  green: 'bg-sb-greenMuted border-sb-green/25 shadow-sb-sm',
  blue: 'bg-sb-blueSoft border-sb-blue/20 shadow-sb-sm',
  warning: 'bg-sb-orangeSoft border-sb-orange/25 shadow-sb-sm',
  danger: 'bg-sb-redSoft border-sb-red/25 shadow-sb-sm',
  glass:
    'bg-[rgba(255,253,247,0.72)] border-[var(--sb-line-glass)] shadow-sb-sm backdrop-blur-[18px]',
  flat: 'bg-sb-surface-muted border-[var(--sb-line)] shadow-none',
  interactive:
    'bg-sb-card-strong border-[var(--sb-line)] shadow-sb-sm transition active:scale-[0.99] hover:border-sb-lineStrong focus-within:ring-2 focus-within:ring-sb-gold/40',
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
      className={`rounded-[26px] border p-4 md:rounded-[30px] md:p-5 lg:p-6 ${variants[variant]} ${className}`}
    >
      {children}
    </Tag>
  )
}
