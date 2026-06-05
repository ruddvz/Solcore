'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const DISMISS_KEY = 'sb-ios-install-dismissed'
const VIEWS_KEY = 'sb-page-views'

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
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (!isIosSafari()) return
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
      const views = Number(localStorage.getItem(VIEWS_KEY) ?? '0') + 1
      localStorage.setItem(VIEWS_KEY, String(views))
    } catch {
      return
    }
  }, [pathname])

  useEffect(() => {
    if (!isIosSafari()) return
    const mark = () => setInteracted(true)
    window.addEventListener('pointerdown', mark, { once: true })
    window.addEventListener('keydown', mark, { once: true })
    return () => {
      window.removeEventListener('pointerdown', mark)
      window.removeEventListener('keydown', mark)
    }
  }, [])

  useEffect(() => {
    if (!isIosSafari() || !interacted) return
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
      const views = Number(localStorage.getItem(VIEWS_KEY) ?? '0')
      if (views >= 2) setVisible(true)
    } catch {
      /* ignore */
    }
  }, [interacted, pathname])

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
      className="fixed bottom-[calc(82px+env(safe-area-inset-bottom))] left-3 right-3 z-30 mx-auto max-w-md rounded-[26px] border border-sb-gold/30 bg-sb-surface p-4 shadow-sb-nav lg:bottom-4"
      role="region"
      aria-label={t('pwa.iosInstallTitle')}
    >
      <p className="sb-card-title">{t('pwa.iosInstallTitle')}</p>
      <p className="sb-caption mt-1">{t('pwa.iosInstallBody')}</p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 min-h-[44px] rounded-sb-md px-4 text-xs font-bold text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
      >
        {t('pwa.iosInstallDismiss')}
      </button>
    </div>
  )
}
