'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { DirectoryContractor } from '@/lib/contractors/types'
import { fetchPublicContractors } from '@/lib/contractors/publicListing'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { SkeletonList } from '@/components/ui/Skeleton'

export function ContractorsListPage() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<DirectoryContractor[]>([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState<string>('')

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={t('contractors.title')} subtitle={t('contractors.subtitle')} />
        <ButtonLink href="/contractors/apply">{t('contractors.applyCta')}</ButtonLink>
      </div>

      <Card>
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
      </Card>

      {loading ? (
        <p className="sr-only">{t('contractors.loading')}</p>
      ) : null}
      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`${withBasePath('/contractors/company')}?slug=${encodeURIComponent(c.slug)}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
            >
              <Card className="h-full transition hover:border-sb-gold/35">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-extrabold text-white">{c.companyName}</div>
                  {c.verified && (
                    <span className="shrink-0 rounded bg-sb-green/20 px-2 py-0.5 text-[10px] font-bold uppercase text-sb-greenMuted">
                      {t('contractors.verified')}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/70">{stateName(c.stateId)}</p>
                {c.technologyTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.technologyTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-sb-bg/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-base text-white/70">{t('contractors.empty')}</p>
      )}

      <p className="text-sm text-white/70">{t('contractors.disclaimer')}</p>
    </div>
  )
}
