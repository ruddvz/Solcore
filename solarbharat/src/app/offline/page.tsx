'use client'

import { useTranslation } from 'react-i18next'
import { Button, ButtonLink } from '@/components/ui/Button'
import { IconOffline } from '@/components/ui/SolarIcons'

export default function OfflinePage() {
  const { t } = useTranslation()
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-sb-xl bg-sb-surface text-sb-goldDark shadow-sb-sm"
        role="img"
        aria-label={t('offline.iconLabel')}
      >
        <IconOffline className="h-8 w-8" />
      </div>
      <h1 className="sb-title-2">{t('offline.title')}</h1>
      <p className="sb-body max-w-sm">{t('offline.body')}</p>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button type="button" onClick={() => window.location.reload()}>
          {t('offline.retry')}
        </Button>
        <ButtonLink href="/report" variant="secondary">
          {t('offline.calculator')}
        </ButtonLink>
      </div>
    </div>
  )
}
