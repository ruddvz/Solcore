import Link from 'next/link'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import type { DirectoryContractor } from '@/lib/contractors/types'

export function ContractorCard({
  contractor,
  stateLabel,
  verifiedLabel,
  viewProfileLabel,
  demoLabel,
  showDemoLabel,
}: {
  contractor: DirectoryContractor
  stateLabel: string
  verifiedLabel: string
  viewProfileLabel: string
  demoLabel?: string
  showDemoLabel?: boolean
}) {
  return (
    <Link
      href={`${withBasePath('/contractors/company')}?slug=${encodeURIComponent(contractor.slug)}`}
      className="block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
    >
      <AppCard variant="interactive" className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[17px] font-bold text-sb-ink">{contractor.companyName}</div>
          {contractor.verified ? (
            <span className="shrink-0 rounded-sb-pill bg-sb-greenMuted px-2.5 py-0.5 text-[10px] font-bold uppercase text-sb-greenDark">
              {verifiedLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-sb-muted">{stateLabel}</p>
        {contractor.technologyTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {contractor.technologyTags.map((tag) => (
              <span
                key={tag}
                className="rounded-sb-pill border border-[var(--sb-line)] bg-sb-goldFaint px-2.5 py-0.5 text-[10px] font-bold uppercase text-sb-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-bold text-sb-goldDark">{viewProfileLabel}</span>
          {showDemoLabel && demoLabel ? (
            <span className="rounded-sb-pill border border-sb-orange/30 bg-sb-orangeSoft px-2 py-0.5 text-[10px] font-bold text-sb-ink-soft">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </AppCard>
    </Link>
  )
}
