'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <EmptyState
      title={t('common.errorTitle')}
      body={t('common.errorBody')}
      primaryAction={{ label: t('common.retry') }}
      secondaryAction={{ href: '/', label: t('common.backHome') }}
      debug={process.env.NODE_ENV === 'development' ? error.message : undefined}
      onPrimaryClick={reset}
    />
  )
}
