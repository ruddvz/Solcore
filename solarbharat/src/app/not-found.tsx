'use client'

import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
      <p className="sb-overline text-white/50">{t('common.notFoundCode')}</p>
      <h1 className="font-heading text-2xl font-extrabold text-white">{t('common.notFoundTitle')}</h1>
      <p className="text-base text-white/60">{t('common.notFoundBody')}</p>
      <ButtonLink href="/">{t('common.backHome')}</ButtonLink>
    </div>
  )
}
