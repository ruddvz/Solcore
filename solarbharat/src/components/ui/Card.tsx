import type { ReactNode } from 'react'
import { AppCard } from '@/components/ui/AppCard'

/** @deprecated Prefer AppCard — kept for compatibility */
export function Card({
  children,
  className = '',
  accent = 'gold',
}: {
  children: ReactNode
  className?: string
  accent?: 'gold' | 'green' | 'blue'
}) {
  const variant =
    accent === 'green' ? 'green' : accent === 'blue' ? 'default' : 'solar'
  return (
    <AppCard variant={variant} className={`border-l-4 ${className}`}>
      {children}
    </AppCard>
  )
}
