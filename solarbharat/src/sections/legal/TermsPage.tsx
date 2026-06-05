'use client'

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export function TermsPage() {
  const { t } = useTranslation()
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title={t('legal.terms.title')}
        overline={t('legal.terms.lastUpdated')}
        subtitle={t('legal.terms.intro')}
      />
      {SECTION_KEYS.map((key) => (
        <section key={key} aria-labelledby={`terms-${key}-heading`}>
          <h2
            id={`terms-${key}-heading`}
            className="text-lg font-extrabold text-sb-gold"
          >
            {t(`legal.terms.${key}h`)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sb-muted">{t(`legal.terms.${key}p`)}</p>
        </section>
      ))}
      <p className="text-sm text-sb-muted">{t('legal.terms.notice')}</p>
    </article>
  )
}
