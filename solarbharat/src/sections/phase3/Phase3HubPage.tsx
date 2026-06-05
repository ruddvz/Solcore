'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import { InfoBanner } from '@/components/ui/InfoBanner'

const SLUGS = [
  'performance',
  'financing',
  'verification',
  'open-access',
  'battery',
  'rooftop',
  'mobile',
  'consultant',
  'tariffs',
] as const

export function Phase3HubPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-page space-y-6">
      <InfoBanner tone="info" title={t('phase3.roadmapLabel')}>
        {t('phase3.roadmapNote')}
      </InfoBanner>

      <div>
        <p className="sb-overline">{t('phase3.roadmapLabel')}</p>
        <h1 className="sb-title-2 mt-2">{t('phase3.title')}</h1>
        <p className="sb-body mt-3 max-w-readable">{t('phase3.intro')}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={withBasePath(`/phase3/${slug}`)}
              className="block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
            >
              <AppCard variant="interactive" className="flex h-full flex-col p-4">
                <span className="sb-card-title">{t(`phase3.cards.${slug}.title`)}</span>
                <span className="sb-caption mt-2 flex-1">{t(`phase3.cards.${slug}.blurb`)}</span>
                <span className="mt-3 text-xs font-bold text-sb-goldDark">{t('phase3.viewFeature')} →</span>
              </AppCard>
            </Link>
          </li>
        ))}
      </ul>

      <p className="sb-caption">{t('phase3.footer')}</p>
    </div>
  )
}
