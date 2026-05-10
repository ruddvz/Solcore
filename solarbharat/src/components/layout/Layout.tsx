'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-sb-bg p-1">
      {(['en', 'hi', 'gu'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          className={`rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
            i18n.language.startsWith(lng)
              ? 'bg-sb-gold text-sb-bg'
              : 'text-white/55 hover:text-white'
          }`}
        >
          {lng}
        </button>
      ))}
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
  { href: '/preview', key: 'preview' as const },
] as const

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const linkClass =
    'whitespace-nowrap rounded-lg px-2 py-2 text-xs font-bold sm:px-2.5 sm:text-sm'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-sb-bg/95 backdrop-blur supports-[backdrop-filter]:bg-sb-bg/85">
        <div className="pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
          <div className="mx-auto flex max-w-6xl flex-col gap-0 px-3 sm:px-4 md:flex-row md:items-center md:gap-3 md:py-2">
            <div className="flex items-center justify-between gap-3 py-2.5 md:contents md:py-0">
              <Link
                href={withBasePath('/')}
                className="flex shrink-0 items-center gap-2 md:order-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sb-gold to-sb-orange text-lg">
                  ☀
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-sm font-black tracking-tight">{t('nav.brand')}</span>
                  <span className="hidden text-[10px] font-bold uppercase tracking-wide text-white/45 sm:block">
                    {t('nav.tagline')}
                  </span>
                </span>
              </Link>
              <div className="shrink-0 md:order-3">
                <LanguageSwitcher />
              </div>
            </div>

            <nav
              className="sb-nav-scroll -mx-1 flex min-h-[44px] min-w-0 flex-1 flex-nowrap items-center gap-x-0.5 overflow-x-auto overscroll-x-contain px-1 py-2 md:order-2 md:gap-x-1 md:py-2"
              aria-label={t('nav.brand')}
            >
              {NAV_KEYS.map(({ href, key }) => {
                const isReport = key === 'report'
                const isPreview = key === 'preview'
                const cls =
                  isReport
                    ? `${linkClass} text-sb-gold hover:text-sb-goldDark`
                    : isPreview
                      ? `${linkClass} text-white/50 hover:text-white/80`
                      : `${linkClass} text-white/70 hover:text-white`
                return (
                  <Link key={href} className={cls} href={withBasePath(href)}>
                    {t(`nav.${key}`)}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-6 sm:px-4 sm:py-8">{children}</main>
      <footer className="border-t border-white/10 bg-sb-surface/40 py-6">
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-3 text-center sm:px-4"
          style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
        >
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-bold">
            <Link className="text-white/55 hover:text-white" href={withBasePath('/terms')}>
              {t('footer.terms')}
            </Link>
            <Link className="text-white/55 hover:text-white" href={withBasePath('/privacy')}>
              {t('footer.privacy')}
            </Link>
            <Link className="text-white/55 hover:text-white" href={withBasePath('/contact')}>
              {t('footer.contact')}
            </Link>
          </nav>
          <p className="text-xs text-white/45">{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  )
}
