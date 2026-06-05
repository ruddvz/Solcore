'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function PwaUpdatePrompt() {
  const { t } = useTranslation()
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const onControllerChange = () => {
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    void navigator.serviceWorker.ready.then((reg) => {
      if (reg.waiting) setWaitingWorker(reg.waiting)

      reg.addEventListener('updatefound', () => {
        const installing = reg.installing
        if (!installing) return
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(reg.waiting ?? installing)
          }
        })
      })
    })

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])

  if (!waitingWorker) return null

  return (
    <div
      role="status"
      className="fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] left-3 right-3 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-sb-gold/30 bg-sb-surface px-4 py-3 shadow-float md:bottom-6"
    >
      <p className="flex-1 text-sm font-medium text-white/90">{t('pwa.updateAvailable')}</p>
      <button
        type="button"
        className="min-h-[44px] shrink-0 rounded-lg bg-sb-gold px-4 text-sm font-bold text-sb-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => {
          waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        }}
      >
        {t('pwa.reload')}
      </button>
    </div>
  )
}
