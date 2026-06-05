import type { ReactNode } from 'react'

export function PageFrame({
  children,
  className = '',
  narrow = false,
}: {
  children: ReactNode
  className?: string
  narrow?: boolean
}) {
  return (
    <div
      className={`sb-page w-full ${narrow ? 'max-w-readable' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
