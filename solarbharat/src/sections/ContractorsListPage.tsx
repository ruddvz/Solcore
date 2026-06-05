'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { DirectoryContractor } from '@/lib/contractors/types'
import { fetchPublicContractors } from '@/lib/contractors/publicListing'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured'
import { AppCard } from '@/components/ui/AppCard'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { SkeletonList } from '@/components/ui/Skeleton'

export function ContractorsListPage() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<DirectoryContractor[]>([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState<string>('')
  const usingDemo = !isSupabaseConfigured()

  const states = listGeographyStates()

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const list = await fetchPublicContractors()
      if (!cancelled) {
        setRows(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!filterState) return rows
    return rows.filter((r) => r.stateId === filterState)
  }, [rows, filterState])

  const stateName = (id: string) => states.find((s) => s.id === id)?.name ?? id

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:space-y-0">
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-wrap items-end justify-between gap-4 lg:flex-col lg:items-stretch">
          <PageHeader title={t('contractors.title')} subtitle={t('contractors.subtitle')} />
          <ButtonLink href="/contractors/apply" className="w-full lg:w-auto">
            {t('contractors.applyCta')}
          </ButtonLink>
        </div>

        <AppCard variant="flat" className="p-4">
          <Select
            id="filter-state"
            label={t('contractors.filterState')}
            value={filterState}
            onChange={setFilterState}
            options={[
              { value: '', label: t('contractors.allStates') },
              ...states.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </AppCard>

        {usingDemo ? (
          <InfoBanner tone="info" title={t('contractors.demoTitle')}>
            {t('contractors.demoBody')}
          </InfoBanner>
        ) : null}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="sr-only">{t('contractors.loading')}</p>
        ) : null}
        {loading ? (
          <SkeletonList count={4} />
        ) : filtered.length > 0 ? (
          <div className="grid gap-3">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`${withBasePath('/contractors/company')}?slug=${encodeURIComponent(c.slug)}`}
                className="block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
              >
                <AppCard variant="interactive" className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[17px] font-bold text-sb-ink">{c.companyName}</div>
                    {c.verified ? (
                      <span className="shrink-0 rounded-sb-pill bg-sb-greenMuted px-2.5 py-0.5 text-[10px] font-bold uppercase text-sb-greenDark">
                        {t('contractors.verified')}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-sb-muted">{stateName(c.stateId)}</p>
                  {c.technologyTags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.technologyTags.map((tag) => (
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
                    <span className="text-xs font-bold text-sb-goldDark">{t('contractors.viewProfile')}</span>
                    {usingDemo ? (
                      <span className="rounded-sb-pill border border-sb-orange/30 bg-sb-orangeSoft px-2 py-0.5 text-[10px] font-bold text-sb-ink-soft">
                        {t('contractors.demoLabel')}
                      </span>
                    ) : null}
                  </div>
                </AppCard>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('contractors.emptyTitle')}
            body={t('contractors.emptyBody')}
            primaryAction={{ href: '/contractors/apply', label: t('contractors.applyCta') }}
          />
        )}

        <p className="sb-caption">{t('contractors.disclaimer')}</p>
      </div>
    </div>
  )
}
