import Link from 'next/link'
import { AppCard } from '@/components/ui/AppCard'
import type { ForumTopicRow } from '@/lib/community/types'

export function ForumTopicCard({
  topic,
  href,
  categoryLabel,
  stateLabel,
  demoLabel,
  showDemoLabel,
}: {
  topic: ForumTopicRow
  href: string
  categoryLabel: string
  stateLabel?: string | null
  demoLabel?: string
  showDemoLabel?: boolean
}) {
  return (
    <Link
      href={href}
      className="block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
    >
      <AppCard variant="interactive" className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="text-[15px] font-bold text-sb-ink">{topic.title}</span>
          <span className="rounded-sb-pill bg-sb-surface-muted px-2.5 py-0.5 text-[10px] font-bold uppercase text-sb-muted">
            {categoryLabel}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-sb-muted">{topic.bodyMd}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-sb-muted-2">
          {stateLabel ? <span>{stateLabel}</span> : null}
          {topic.schemeTag ? <span>· {topic.schemeTag}</span> : null}
          {showDemoLabel && demoLabel ? (
            <span className="rounded-sb-pill border border-sb-orange/30 bg-sb-orangeSoft px-2 py-0.5 text-sb-ink-soft">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </AppCard>
    </Link>
  )
}
