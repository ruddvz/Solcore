'use client'

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export function PrivacyPage() {
  const { t } = useTranslation()
  return (
    <article className="mx-auto max-w-readable space-y-8">
      <PageHeader
        title={t('legal.privacy.title')}
        overline={t('legal.privacy.lastUpdated')}
        subtitle={t('legal.privacy.intro')}
      />
      {SECTION_KEYS.map((key) => (
        <section key={key} aria-labelledby={`privacy-${key}-heading`}>
          <h2
            id={`privacy-${key}-heading`}
            className="text-lg font-extrabold text-sb-gold"
          >
            {t(`legal.privacy.${key}h`)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sb-muted">{t(`legal.privacy.${key}p`)}</p>
        </section>
      ))}
      <p className="text-sm text-sb-muted">{t('legal.privacy.notice')}</p>
    </article>
  )
}
