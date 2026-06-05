'use client'

import { useTranslation } from 'react-i18next'
import { AppCard } from '@/components/ui/AppCard'
import { PageHeader } from '@/components/ui/PageHeader'

function supportEmail(): string {
  return (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '').trim()
}

export function ContactPage() {
  const { t } = useTranslation()
  const email = supportEmail()
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title={t('legal.contact.title')} subtitle={t('legal.contact.intro')} />

      <AppCard>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-sb-gold">
          {t('legal.contact.emailHeading')}
        </h2>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="mt-3 block break-all text-lg font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold rounded"
          >
            {email}
          </a>
        ) : (
          <p className="mt-3 text-sm text-sb-muted">{t('legal.contact.noEmail')}</p>
        )}
        <p className="mt-4 text-xs text-sb-muted">{t('legal.contact.envHint')}</p>
      </AppCard>

      <p className="text-sm text-sb-muted">{t('legal.contact.responseTime')}</p>
    </div>
  )
}
