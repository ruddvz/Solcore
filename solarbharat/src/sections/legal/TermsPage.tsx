'use client'

import { useTranslation } from 'react-i18next'

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export function TermsPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">{t('legal.terms.title')}</h1>
        <p className="mt-2 text-sm text-white/45">{t('legal.terms.lastUpdated')}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/70">{t('legal.terms.intro')}</p>
      </div>
      {SECTION_KEYS.map((key) => (
        <section key={key}>
          <h2 className="text-lg font-extrabold text-sb-gold">{t(`legal.terms.${key}h`)}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t(`legal.terms.${key}p`)}</p>
        </section>
      ))}
      <p className="text-xs text-white/40">{t('legal.terms.notice')}</p>
    </div>
  )
}
