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
    <div className="flex flex-col items-center gap-4 rounded-sb-xl border border-sb-line bg-sb-surface px-6 py-10 text-center shadow-sb-sm">
      {icon ? (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-sb-lg bg-sb-goldSoft text-2xl text-sb-goldDark"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h2 className="sb-title-2">{title}</h2>
      <p className="sb-body max-w-md">{body}</p>
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
