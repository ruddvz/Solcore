import type { ReactNode } from 'react'

const tones = {
  solar: 'bg-sb-goldFaint border-sb-gold/25',
  green: 'bg-sb-greenMuted border-sb-green/20',
  blue: 'bg-sb-blueSoft border-sb-blue/20',
  warning: 'bg-sb-orangeSoft border-sb-orange/20',
  danger: 'bg-sb-redSoft border-sb-red/20',
  neutral: 'bg-sb-surface border-sb-line',
} as const

export function MetricCard({
  label,
  value,
  helper,
  tone = 'neutral',
  icon,
  className = '',
}: {
  label: string
  value: string
  helper?: string
  tone?: keyof typeof tones
  icon?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-sb-lg border p-4 shadow-sb-sm ${tones[tone]} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="sb-overline text-sb-muted">{label}</p>
        {icon ? <span className="text-sb-muted" aria-hidden>{icon}</span> : null}
      </div>
      <p className="sb-tabular mt-2 text-[30px] font-extrabold leading-tight tracking-tight text-sb-ink">
        {value}
      </p>
      {helper ? <p className="sb-caption mt-1">{helper}</p> : null}
    </div>
  )
}
