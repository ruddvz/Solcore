'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">{t('phase3.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{t('phase3.intro')}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={withBasePath(`/phase3/${slug}`)}
              className="flex flex-col rounded-2xl border border-white/10 bg-sb-surface/40 px-5 py-4 transition hover:border-sb-gold/35 hover:text-sb-gold"
            >
              <span className="font-extrabold text-white">{t(`phase3.cards.${slug}.title`)}</span>
              <span className="mt-1 text-xs text-white/50">{t(`phase3.cards.${slug}.blurb`)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-white/40">{t('phase3.footer')}</p>
    </div>
  )
}
