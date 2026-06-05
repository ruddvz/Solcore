import type { ReactNode } from 'react'

const styles = {
  info: 'border-sb-blue/25 bg-sb-blueSoft text-sb-ink',
  success: 'border-sb-green/25 bg-sb-greenMuted text-sb-ink',
  warning: 'border-sb-orange/30 bg-sb-orangeSoft text-sb-ink',
  danger: 'border-sb-red/25 bg-sb-redSoft text-sb-ink',
  legal: 'border-sb-line bg-sb-surface-muted text-sb-ink-soft',
} as const

export function InfoBanner({
  title,
  children,
  tone = 'info',
  className = '',
}: {
  title?: string
  children: ReactNode
  tone?: keyof typeof styles
  className?: string
}) {
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={`rounded-sb-md border px-4 py-3 ${styles[tone]} ${className}`}
    >
      {title ? <p className="text-sm font-semibold text-sb-ink">{title}</p> : null}
      <div className={`text-sm leading-relaxed ${title ? 'mt-1' : ''}`}>{children}</div>
    </div>
  )
}
