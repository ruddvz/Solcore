'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { QuotaSnapshotRow } from '@/lib/community/types'
import { fetchQuotaSnapshots } from '@/lib/community/publicData'
import { listGeographyStates, getGeographyDistrict } from '@/lib/region'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonList } from '@/components/ui/Skeleton'

function bandStyle(band: string): string {
  switch (band) {
    case 'available':
      return 'bg-sb-green/20 text-sb-greenMuted'
    case 'limited':
      return 'bg-sb-orange/15 text-sb-orange'
    case 'nearly_full':
      return 'bg-sb-orange/25 text-sb-orange'
    case 'closed':
      return 'bg-sb-red/20 text-sb-red'
    default:
      return 'bg-white/10 text-white/55'
  }
}

export function QuotaTrackerPage() {
  const { t, i18n } = useTranslation()
  const [rows, setRows] = useState<QuotaSnapshotRow[]>([])
  const [loading, setLoading] = useState(true)
  const states = listGeographyStates()

  useEffect(() => {
    let c = false
    void (async () => {
      const data = await fetchQuotaSnapshots()
      if (!c) {
        setRows(data)
        setLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const stateName = (id: string) => states.find((s) => s.id === id)?.name ?? id
  const districtName = (stateId: string, districtId: string | null) => {
    if (!districtId) return t('quota.statewide')
    return getGeographyDistrict(stateId, districtId)?.name ?? districtId
  }

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => a.stateId.localeCompare(b.stateId))
  }, [rows])

  const locale = i18n.language?.startsWith('hi')
    ? 'hi-IN'
    : i18n.language?.startsWith('gu')
      ? 'gu-IN'
      : 'en-IN'

  return (
    <div className="space-y-8">
      <PageHeader title={t('quota.title')} subtitle={t('quota.subtitle')} />

      {loading ? <p className="sr-only">{t('quota.loading')}</p> : null}
      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <div className="space-y-3">
          {sorted.map((q) => (
            <Card key={q.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-white">
                    {stateName(q.stateId)}
                    {' · '}
                    {districtName(q.stateId, q.districtId)}
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    {t('quota.updated')}:{' '}
                    {new Date(q.capturedAt).toLocaleString(locale, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  {q.sourceDetail && (
                    <p className="mt-2 text-sm text-white/55">{q.sourceDetail}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded px-2 py-1 text-[11px] font-bold uppercase ${bandStyle(q.statusBand)}`}
                  >
                    {t(`quota.band.${q.statusBand}`, q.statusBand)}
                  </span>
                  {q.mwRemaining != null && (
                    <p className="mt-2 font-mono text-sm text-sb-gold">
                      ~{q.mwRemaining} MW
                    </p>
                  )}
                  <p className="mt-1 text-[10px] uppercase text-white/35">{q.source}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && sorted.length === 0 && (
        <p className="text-center text-base text-white/50">{t('quota.empty')}</p>
      )}

      <p className="text-sm text-white/50">{t('quota.disclaimer')}</p>
    </div>
  )
}
