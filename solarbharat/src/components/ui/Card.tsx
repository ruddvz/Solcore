import type { ReactNode } from 'react'
import { AppCard } from '@/components/ui/AppCard'

/** Thin wrapper — prefer AppCard directly in new code. */
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
    accent === 'green' ? 'green' : accent === 'blue' ? 'blue' : accent === 'gold' ? 'solar' : 'default'
  return (
    <AppCard variant={variant} className={className}>
      {children}
    </AppCard>
  )
}
