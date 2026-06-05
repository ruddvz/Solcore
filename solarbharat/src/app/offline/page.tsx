'use client'

import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/Button'

export default function OfflinePage() {
  const { t } = useTranslation()
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-sb-bg px-6 text-center"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sb-surface text-2xl"
        role="img"
        aria-label={t('offline.iconLabel')}
      >
        <span aria-hidden>📡</span>
      </div>
      <h1 className="font-heading text-2xl font-extrabold text-white">{t('offline.title')}</h1>
      <p className="max-w-sm text-base text-white/60">{t('offline.body')}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">{t('offline.retry')}</ButtonLink>
        <ButtonLink href="/calculator" variant="secondary">
          {t('offline.calculator')}
        </ButtonLink>
      </div>
    </div>
  )
}
