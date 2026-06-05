'use client'

import Link from 'next/link'
import { withBasePath } from '@/lib/publicBasePath'
import { useTranslation } from 'react-i18next'

const VALID = new Set([
  'performance',
  'financing',
  'verification',
  'open-access',
  'battery',
  'rooftop',
  'mobile',
  'consultant',
  'tariffs',
])

type Props = { slug: string }

export function Phase3FeaturePage({ slug }: Props) {
  const { t } = useTranslation()
  const ok = VALID.has(slug)

  if (!ok) {
    return (
      <div className="space-y-4">
        <p className="text-white/70">{t('phase3.notFound')}</p>
        <Link href={withBasePath('/phase3')} className="text-sm font-bold text-sb-gold hover:text-sb-goldDark">
          ← {t('phase3.backHub')}
        </Link>
      </div>
    )
  }

  const items = t(`phase3.detail.${slug}.bullets`, { returnObjects: true }) as string[]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href={withBasePath('/phase3')} className="text-xs font-bold text-sb-gold hover:text-sb-goldDark">
          ← {t('phase3.backHub')}
        </Link>
        <h1 className="mt-4 text-3xl font-black text-white">{t(`phase3.detail.${slug}.title`)}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{t(`phase3.detail.${slug}.body`)}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-sb-surface/40 p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-sb-gold">
          {t('phase3.detail.scope')}
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-white/80">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/65">{t(`phase3.detail.${slug}.note`)}</p>
    </div>
  )
}
