'use client'

import { useTranslation } from 'react-i18next'

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export function PrivacyPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">{t('legal.privacy.title')}</h1>
        <p className="mt-2 text-sm text-white/45">{t('legal.privacy.lastUpdated')}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/70">{t('legal.privacy.intro')}</p>
      </div>
      {SECTION_KEYS.map((key) => (
        <section key={key}>
          <h2 className="text-lg font-extrabold text-sb-gold">{t(`legal.privacy.${key}h`)}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t(`legal.privacy.${key}p`)}</p>
        </section>
      ))}
      <p className="text-xs text-white/40">{t('legal.privacy.notice')}</p>
    </div>
  )
}
