'use client'

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'

function supportEmail(): string {
  return (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '').trim()
}

export function ContactPage() {
  const { t } = useTranslation()
  const email = supportEmail()
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">{t('legal.contact.title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{t('legal.contact.intro')}</p>
      </div>

      <Card>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-sb-gold">
          {t('legal.contact.emailHeading')}
        </h2>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="mt-3 block break-all text-lg font-bold text-sb-gold hover:text-sb-goldDark"
          >
            {email}
          </a>
        ) : (
          <p className="mt-3 text-sm text-white/55">{t('legal.contact.noEmail')}</p>
        )}
        <p className="mt-4 text-xs text-white/40">{t('legal.contact.envHint')}</p>
      </Card>

      <p className="text-sm text-white/55">{t('legal.contact.responseTime')}</p>
    </div>
  )
}
