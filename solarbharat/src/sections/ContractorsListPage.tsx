'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DirectoryContractor } from '@/lib/contractors/types'
import { fetchPublicContractors } from '@/lib/contractors/publicListing'
import { listGeographyStates } from '@/lib/region'
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured'
import { AppCard } from '@/components/ui/AppCard'
import { ContractorCard } from '@/components/ui/ContractorCard'
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
              <ContractorCard
                key={c.id}
                contractor={c}
                stateLabel={stateName(c.stateId)}
                verifiedLabel={t('contractors.verified')}
                viewProfileLabel={t('contractors.viewProfile')}
                demoLabel={t('contractors.demoLabel')}
                showDemoLabel={usingDemo}
              />
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
