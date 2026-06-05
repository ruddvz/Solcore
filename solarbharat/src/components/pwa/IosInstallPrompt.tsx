'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DISMISS_KEY = 'sb-ios-install-dismissed'

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone)
  return isIos && !isStandalone && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua)
}

export function IosInstallPrompt() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isIosSafari()) return
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      return
    }
    setVisible(true)
  }, [])

  if (!visible) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  return (
    <div
      className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-3 right-3 z-30 mx-auto max-w-md rounded-2xl border border-sb-gold/30 bg-sb-surface p-4 shadow-float md:bottom-4"
      role="region"
      aria-label={t('pwa.iosInstallTitle')}
    >
      <p className="font-heading text-sm font-bold text-white">{t('pwa.iosInstallTitle')}</p>
      <p className="mt-1 text-xs text-white/60">{t('pwa.iosInstallBody')}</p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 min-h-[44px] rounded-xl px-4 text-xs font-bold text-sb-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
      >
        {t('pwa.iosInstallDismiss')}
      </button>
    </div>
  )
}
