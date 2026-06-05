import { ButtonLink } from '@/components/ui/Button'

export function EmptyState({
  title,
  body,
  primaryAction,
  secondaryAction,
  icon,
}: {
  title: string
  body: string
  primaryAction?: { href: string; label: string }
  secondaryAction?: { href: string; label: string }
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[20px] border border-white/10 bg-sb-surface/60 px-6 py-10 text-center">
      {icon ? (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-sb-gold"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h2 className="font-heading text-xl font-bold text-white">{title}</h2>
      <p className="max-w-md text-base text-white/60">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {primaryAction ? (
          <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
        ) : null}
        {secondaryAction ? (
          <ButtonLink href={secondaryAction.href} variant="secondary">
            {secondaryAction.label}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  )
}
