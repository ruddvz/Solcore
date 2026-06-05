import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/Button'

export function EmptyState({
  title,
  body,
  primaryAction,
  secondaryAction,
  icon,
  debug,
  onPrimaryClick,
}: {
  title: string
  body: string
  primaryAction?: { href?: string; label: string }
  secondaryAction?: { href: string; label: string }
  icon?: React.ReactNode
  debug?: string
  onPrimaryClick?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-sb-xl border border-sb-line bg-sb-surface px-6 py-10 text-center shadow-sb-sm">
      {icon ? (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-sb-lg bg-sb-goldSoft text-sb-goldDark"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h2 className="sb-title-2">{title}</h2>
      <p className="sb-body max-w-md">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {primaryAction ? (
          onPrimaryClick ? (
            <Button type="button" onClick={onPrimaryClick}>
              {primaryAction.label}
            </Button>
          ) : primaryAction.href ? (
            <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
          ) : null
        ) : null}
        {secondaryAction ? (
          <ButtonLink href={secondaryAction.href} variant="secondary">
            {secondaryAction.label}
          </ButtonLink>
        ) : null}
      </div>
      {debug ? (
        <p className="sb-caption max-w-md break-words text-sb-muted-2">{debug}</p>
      ) : null}
    </div>
  )
}
