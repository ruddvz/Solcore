'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { isActivePath, withBasePath } from '@/lib/publicBasePath'
import { MoreMenuSheet } from '@/components/layout/MoreMenuSheet'
import {
  IconCalculator,
  IconContractors,
  IconHome,
  IconReport,
} from '@/components/ui/SolarIcons'

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation()
  return (
    <div
      className={`flex shrink-0 items-center gap-0.5 rounded-sb-pill border border-sb-line bg-sb-surface p-0.5 ${compact ? '' : ''}`}
      role="group"
      aria-label={t('a11y.language')}
    >
      {(['en', 'hi', 'gu'] as const).map((lng) => {
        const active = i18n.language.startsWith(lng)
        return (
          <button
            key={lng}
            type="button"
            lang={lng}
            aria-pressed={active}
            aria-label={t(`lang.${lng}`)}
            onClick={() => void i18n.changeLanguage(lng)}
            className={`min-h-[36px] min-w-[36px] rounded-sb-pill px-2.5 text-[11px] font-bold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold ${
              active ? 'bg-sb-goldSoft text-sb-ink' : 'text-sb-muted hover:text-sb-ink'
            }`}
          >
            {lng}
          </button>
        )
      })}
    </div>
  )
}

const DESKTOP_NAV = [
  { href: '/', key: 'home' as const },
  { href: '/calculator', key: 'calculator' as const },
  { href: '/report', key: 'report' as const },
  { href: '/contractors', key: 'contractors' as const },
  { href: '/locations', key: 'locations' as const },
  { href: '/forum', key: 'forum' as const },
  { href: '/quota', key: 'quota' as const },
] as const

const TAB_ITEMS = [
  { href: '/', key: 'home' as const, Icon: IconHome },
  { href: '/calculator', key: 'calculator' as const, Icon: IconCalculator },
  { href: '/report', key: 'report' as const, Icon: IconReport },
  { href: '/contractors', key: 'contractors' as const, Icon: IconContractors },
] as const

const linkFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sb-bg'

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const pathname = usePathname() ?? '/'
  const [moreOpen, setMoreOpen] = useState(false)
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = moreOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [moreOpen])

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false)
        moreTriggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-sb-md focus:bg-sb-gold focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-sb-ink"
      >
        {t('a11y.skipToContent')}
      </a>

      <header className="sticky top-0 z-30 border-b border-sb-line-soft bg-[rgba(255,248,223,0.78)] backdrop-blur-[18px] supports-[backdrop-filter]:bg-[rgba(255,248,223,0.72)]">
        <div className="pt-[max(0px,env(safe-area-inset-top,0px))]">
          <div className="mx-auto flex h-16 max-w-page items-center gap-3 px-4 md:px-6">
            <Link
              href={withBasePath('/')}
              aria-label={t('nav.brand')}
              className={`${linkFocus} flex min-h-[44px] shrink-0 items-center gap-2 rounded-sb-md`}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-sb-md bg-gradient-to-br from-sb-gold to-sb-orange text-lg shadow-sb-sm"
                aria-hidden
              >
                ☀
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-extrabold tracking-tight text-sb-ink">
                  {t('nav.brand')}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-sb-muted">
                  {t('nav.tagline')}
                </span>
              </span>
            </Link>

            <nav
              className="sb-nav-scroll hidden min-h-[44px] flex-1 flex-nowrap items-center gap-1 overflow-x-auto md:flex"
              aria-label={t('nav.mainNav')}
            >
              {DESKTOP_NAV.map(({ href, key }) => {
                const active = isActivePath(pathname, href)
                return (
                  <Link
                    key={href}
                    href={withBasePath(href)}
                    aria-current={active ? 'page' : undefined}
                    className={`${linkFocus} whitespace-nowrap rounded-sb-pill px-3 py-2 text-sm font-semibold ${
                      active
                        ? 'bg-sb-goldSoft text-sb-ink'
                        : 'text-sb-muted hover:bg-sb-surface-muted hover:text-sb-ink'
                    }`}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                )
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="sb-page mx-auto w-full max-w-page flex-1">
        {children}
      </main>

      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(10px,env(safe-area-inset-bottom))] md:hidden"
        aria-label={t('nav.mainNav')}
      >
        <div
          className="pointer-events-auto flex h-[66px] w-[calc(100%-24px)] max-w-[430px] items-center justify-around rounded-sb-pill border border-sb-line-soft bg-[rgba(255,253,247,0.86)] px-2 shadow-sb-nav backdrop-blur-[22px] backdrop-saturate-[1.25]"
        >
          {TAB_ITEMS.map(({ href, key, Icon }) => {
            const active = isActivePath(pathname, href)
            return (
              <Link
                key={href}
                href={withBasePath(href)}
                aria-current={active ? 'page' : undefined}
                className={`${linkFocus} flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-sb-pill px-1 ${
                  active ? 'bg-sb-goldSoft text-sb-ink' : 'text-sb-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold leading-none">{t(`nav.${key}`)}</span>
              </Link>
            )
          })}
          <button
            ref={moreTriggerRef}
            type="button"
            aria-expanded={moreOpen}
            aria-label={t('nav.more')}
            onClick={() => setMoreOpen(true)}
            className={`${linkFocus} flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-sb-pill px-1 text-sb-muted`}
          >
            <span className="text-lg leading-none" aria-hidden>
              ⋯
            </span>
            <span className="text-[10px] font-semibold leading-none">{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      <MoreMenuSheet open={moreOpen} onClose={() => setMoreOpen(false)} pathname={pathname} />

      <footer className="hidden border-t border-sb-line bg-sb-surface/80 py-8 md:block">
        <div className="mx-auto flex max-w-page flex-col items-center gap-3 px-6 text-center">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-sb-muted">
            <Link className={`${linkFocus} hover:text-sb-ink`} href={withBasePath('/terms')}>
              {t('footer.terms')}
            </Link>
            <Link className={`${linkFocus} hover:text-sb-ink`} href={withBasePath('/privacy')}>
              {t('footer.privacy')}
            </Link>
            <Link className={`${linkFocus} hover:text-sb-ink`} href={withBasePath('/contact')}>
              {t('footer.contact')}
            </Link>
          </nav>
          <p className="sb-caption max-w-readable">{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  )
}
