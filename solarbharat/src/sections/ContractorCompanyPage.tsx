'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import type { DirectoryContractor } from '@/lib/contractors/types'
import { fetchContractorBySlug } from '@/lib/contractors/publicListing'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonCard } from '@/components/ui/Skeleton'

const backLinkClass =
  'text-xs font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold rounded'

export function ContractorCompanyPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') ?? ''
  const [loading, setLoading] = useState(true)
  const [contractor, setContractor] = useState<DirectoryContractor | null>(null)
  const states = listGeographyStates()

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      if (!slug.trim()) {
        setContractor(null)
        setLoading(false)
        return
      }
      const row = await fetchContractorBySlug(slug)
      if (!cancelled) {
        setContractor(row)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  const stateName = (id: string) => states.find((s) => s.id === id)?.name ?? id

  if (loading) {
    return (
      <div className="space-y-8">
        <p className="sr-only">{t('contractors.loading')}</p>
        <SkeletonCard />
      </div>
    )
  }

  if (!contractor) {
    return (
      <div className="space-y-4 py-8">
        <Link href={withBasePath('/contractors')} className={backLinkClass}>
          ← {t('contractors.backToDirectory')}
        </Link>
        <p className="text-sb-muted">{t('contractors.companyNotFound')}</p>
      </div>
    )
  }

  const c = contractor
  const paragraphs = (c.profileMd ?? '').split(/\n\n+/).filter(Boolean)

  return (
    <div className="space-y-8">
      <div>
        <Link href={withBasePath('/contractors')} className={backLinkClass}>
          ← {t('contractors.backToDirectory')}
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <PageHeader title={c.companyName} />
          {c.verified && (
            <span className="rounded bg-sb-green/20 px-2 py-1 text-[11px] font-bold uppercase text-sb-greenMuted">
              {t('contractors.verified')}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-sb-muted">
          {stateName(c.stateId)}
          {c.districtIds.length > 0
            ? ` · ${t('contractors.districtCount', { count: c.districtIds.length })}`
            : ''}
        </p>
      </div>

      <AppCard>
        <div className="space-y-3 text-sm leading-relaxed text-sb-ink-soft">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-sb-muted">{t('contractors.noProfile')}</p>
          )}
        </div>

        {(c.contactEmail || c.contactPhone) && (
          <div className="mt-6 border-t border-sb-line pt-4 text-sm">
            <div className="text-[11px] font-bold uppercase text-sb-muted">{t('contractors.contact')}</div>
            {c.contactEmail && (
              <a href={`mailto:${c.contactEmail}`} className="mt-1 block text-sb-gold hover:underline">
                {c.contactEmail}
              </a>
            )}
            {c.contactPhone && <p className="mt-1 font-mono text-sb-ink-soft">{c.contactPhone}</p>}
          </div>
        )}
      </AppCard>

      <p className="text-sm text-sb-muted">{t('contractors.verifyDisclaimer')}</p>
    </div>
  )
}
