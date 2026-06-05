'use client'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/EmptyState'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <EmptyState
      title={t('common.notFoundTitle')}
      body={t('common.notFoundBody')}
      primaryAction={{ href: '/', label: t('common.backHome') }}
      secondaryAction={{ href: '/calculator', label: t('nav.calculator') }}
      icon={<span className="text-xl font-bold">404</span>}
    />
  )
}
