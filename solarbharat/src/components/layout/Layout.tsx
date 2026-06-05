'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { isActivePath, withBasePath } from '@/lib/publicBasePath'

const SHOW_PREVIEW = process.env.NEXT_PUBLIC_SHOW_PREVIEW === '1'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-sb-bg p-1"
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
            className={`min-h-[44px] min-w-[44px] rounded-lg px-3 text-xs font-bold uppercase tracking-[0.08em] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold ${
              active ? 'bg-sb-gold text-sb-bg' : 'text-white/70 hover:text-white'
            }`}
          >
            {lng}
          </button>
        )
      })}
    </div>
  )
}

const NAV_KEYS = [
  { href: '/', key: 'home' as const },
  { href: '/locations', key: 'locations' as const },
  { href: '/calculator', key: 'calculator' as const },
  { href: '/contractors', key: 'contractors' as const },
  { href: '/quota', key: 'quota' as const },
  { href: '/forum', key: 'forum' as const },
  { href: '/plan', key: 'plan' as const },
  { href: '/quotes', key: 'quotes' as const },
  { href: '/phase3', key: 'phase3' as const },
  { href: '/reviews/submit', key: 'reviews' as const },
  { href: '/financing/interest', key: 'financing' as const },
  { href: '/alerts', key: 'alerts' as const },
  { href: '/report', key: 'report' as const },
  { href: '/preview', key: 'preview' as const, devOnly: true },
] as const

const MOBILE_TAB_KEYS = ['home', 'calculator', 'report', 'contractors'] as const

const linkFocus =
  'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sb-bg'

function NavLink({
  href,
  label,
  active,
  className,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  className: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href={withBasePath(href)}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
      className={`${linkFocus} ${className}`}
    >
      {label}
    </Link>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const pathname = usePathname() ?? '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null)
  const sheetCloseRef = useRef<HTMLButtonElement | null>(null)

  const navItems = NAV_KEYS.filter((item) => !('devOnly' in item && item.devOnly) || SHOW_PREVIEW)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    sheetCloseRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuTriggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const desktopLinkClass =
    'whitespace-nowrap px-2.5 py-2.5 text-xs font-bold sm:text-sm min-h-[44px] inline-flex items-center'

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-sb-gold focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-sb-bg"
      >
        {t('a11y.skipToContent')}
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-sb-bg/90 backdrop-blur-xl supports-[backdrop-filter]:bg-sb-bg/80">
        <div className="pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 sm:px-4 md:gap-3 md:py-2">
            <Link
              href={withBasePath('/')}
              className={`${linkFocus} flex min-h-[44px] shrink-0 items-center gap-2`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sb-gold to-sb-orange text-lg">
                ☀
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-black tracking-tight">{t('nav.brand')}</span>
                <span className="hidden text-[10px] font-bold uppercase tracking-wide text-white/70 sm:block">
                  {t('nav.tagline')}
                </span>
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-2 md:ml-0">
              <button
                type="button"
                className={`${linkFocus} inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-bold text-white md:hidden`}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-sheet"
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
              </button>
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
            </div>

            <nav
              className="sb-nav-scroll hidden min-h-[44px] min-w-0 flex-1 flex-nowrap items-center gap-0.5 overflow-x-auto md:flex"
              aria-label={t('nav.mainNav')}
            >
              {navItems.map(({ href, key }) => {
                const active = isActivePath(pathname, href)
                const isReport = key === 'report'
                const isPreview = key === 'preview'
                const cls = isReport
                  ? `${desktopLinkClass} text-sb-gold hover:text-sb-goldDark`
                  : isPreview
                    ? `${desktopLinkClass} text-white/70 hover:text-white/80`
                    : active
                      ? `${desktopLinkClass} bg-white/10 text-white`
                      : `${desktopLinkClass} text-white/70 hover:text-white`
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={t(`nav.${key}`)}
                    active={active}
                    className={cls}
                  />
                )
              })}
            </nav>

            <div className="hidden shrink-0 md:block md:ml-auto">
              {/* spacer when lang is in header row on md+ */}
            </div>
            <div className="hidden md:order-last md:flex">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

      </header>

      {/* Fixed mobile bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/10 bg-sb-bg/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        aria-label={t('nav.mainNav')}
      >
        {MOBILE_TAB_KEYS.map((key) => {
          const item = navItems.find((n) => n.key === key)!
          const active = isActivePath(pathname, item.href)
          return (
            <NavLink
              key={key}
              href={item.href}
              label={t(`nav.${key}`)}
              active={active}
              className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-bold uppercase tracking-wide ${
                active ? 'text-sb-gold' : 'text-white/70'
              }`}
            />
          )
        })}
        <button
          ref={menuTriggerRef}
          type="button"
          className={`${linkFocus} flex min-h-[52px] flex-1 flex-col items-center justify-center px-1 text-[10px] font-bold uppercase tracking-wide text-white/70`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={t('nav.more')}
          onClick={() => setMenuOpen(true)}
        >
          {t('nav.more')}
        </button>
      </nav>

      {/* Full-screen menu sheet */}
      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label={t('nav.menuClose')}
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.mainNav')}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[20px] border border-white/10 bg-sb-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-white">{t('nav.mainNav')}</span>
              <button
                ref={sheetCloseRef}
                type="button"
                className={`${linkFocus} min-h-[44px] rounded-xl px-4 text-sm font-bold text-sb-gold`}
                onClick={() => {
                  setMenuOpen(false)
                  menuTriggerRef.current?.focus()
                }}
              >
                {t('nav.menuClose')}
              </button>
            </div>
            <LanguageSwitcher />
            <ul className="mt-4 grid gap-1">
              {navItems.map(({ href, key }) => {
                const active = isActivePath(pathname, href)
                return (
                  <li key={href}>
                    <NavLink
                      href={href}
                      label={t(`nav.${key}`)}
                      active={active}
                      onNavigate={() => setMenuOpen(false)}
                      className={`flex min-h-[48px] w-full items-center rounded-xl px-4 text-base font-bold ${
                        active ? 'bg-sb-gold/15 text-sb-gold' : 'text-white/85 hover:bg-white/5'
                      }`}
                    />
                  </li>
                )
              })}
            </ul>
            <nav className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-sm font-bold">
              <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/terms')}>
                {t('footer.terms')}
              </Link>
              <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/privacy')}>
                {t('footer.privacy')}
              </Link>
              <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/contact')}>
                {t('footer.contact')}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}

      <main
        id="main-content"
        className="app-main-with-bottom-nav mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-6 sm:px-4 sm:py-8 md:pb-8"
      >
        {children}
      </main>

      <footer className="hidden border-t border-white/10 bg-sb-surface/40 py-6 md:block">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-3 text-center sm:px-4"
          style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        >
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-bold" aria-label={t('footer.legalNav')}>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/terms')}>
              {t('footer.terms')}
            </Link>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/privacy')}>
              {t('footer.privacy')}
            </Link>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/contact')}>
              {t('footer.contact')}
            </Link>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/calculator')}>
              {t('nav.calculator')}
            </Link>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/locations')}>
              {t('nav.locations')}
            </Link>
            <Link className={`${linkFocus} text-white/70 hover:text-white`} href={withBasePath('/alerts')}>
              {t('nav.alerts')}
            </Link>
          </nav>
          <p className="text-xs text-white/70">{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  )
}
