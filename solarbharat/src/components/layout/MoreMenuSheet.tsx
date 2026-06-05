'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { withBasePath, isActivePath } from '@/lib/publicBasePath'

const MORE_LINKS = [
  { href: '/locations', key: 'locations' as const },
  { href: '/forum', key: 'forum' as const },
  { href: '/quota', key: 'quota' as const },
  { href: '/alerts', key: 'alerts' as const },
  { href: '/quotes', key: 'quotes' as const },
  { href: '/financing/interest', key: 'financing' as const },
  { href: '/reviews/submit', key: 'reviews' as const },
  { href: '/plan', key: 'plan' as const },
  { href: '/phase3', key: 'phase3' as const },
  { href: '/preview', key: 'preview' as const },
] as const

const MORE_FOOTER = [
  { href: '/privacy', labelKey: 'footer.privacy' as const },
  { href: '/terms', labelKey: 'footer.terms' as const },
  { href: '/contact', labelKey: 'footer.contact' as const },
] as const

const linkClass =
  'flex min-h-[48px] w-full items-center rounded-sb-md px-4 text-base font-semibold text-sb-ink hover:bg-sb-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold'

export function MoreMenuSheet({
  open,
  onClose,
  pathname,
  returnFocusRef,
}: {
  open: boolean
  onClose: () => void
  pathname: string
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>
}) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        returnFocusRef?.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, returnFocusRef])

  useEffect(() => {
    if (!open || !panelRef.current) return
    const panel = panelRef.current
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    panel.addEventListener('keydown', trap)
    return () => panel.removeEventListener('keydown', trap)
  }, [open])

  if (!open) return null

  const sheet = (
    <>
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-sb-line-strong" aria-hidden />
      <div className="mb-3 flex items-center justify-between">
        <h2 className="sb-card-title">{t('nav.more')}</h2>
        <button
          ref={closeRef}
          type="button"
          className="min-h-[44px] rounded-sb-sm px-3 text-sm font-bold text-sb-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
          onClick={() => {
            onClose()
            returnFocusRef?.current?.focus()
          }}
        >
          {t('nav.menuClose')}
        </button>
      </div>
      <ul className="grid gap-1">
        {MORE_LINKS.map(({ href, key }) => {
          const active = isActivePath(pathname, href)
          return (
            <li key={href}>
              <Link
                href={withBasePath(href)}
                className={`${linkClass} ${active ? 'bg-sb-goldSoft text-sb-ink' : ''}`}
                onClick={onClose}
              >
                {t(`nav.${key}`)}
              </Link>
            </li>
          )
        })}
      </ul>
      <ul className="mt-4 grid gap-1 border-t border-[var(--sb-line)] pt-4">
        {MORE_FOOTER.map(({ href, labelKey }) => (
          <li key={href}>
            <Link href={withBasePath(href)} className={linkClass} onClick={onClose}>
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-sb-ink/25 backdrop-blur-[2px]"
        aria-label={t('nav.menuClose')}
        onClick={() => {
          onClose()
          returnFocusRef?.current?.focus()
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.more')}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[30px] border border-[var(--sb-line)] bg-sb-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-sb-lg lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:max-h-[80vh] lg:w-full lg:max-w-md lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[30px] lg:px-5 lg:py-4"
      >
        {sheet}
      </div>
    </div>
  )
}
