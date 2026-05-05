'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-sb-bg p-1">
      {(['en', 'hi', 'gu'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          className={`rounded-md px-2 py-1 text-[11px] font-bold uppercase ${
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

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-sb-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sb-gold to-sb-orange text-lg">
              ☀
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-black tracking-tight">{t('nav.brand')}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-white/45">
                {t('nav.tagline')}
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-bold">
            <Link className="text-white/70 hover:text-white" href="/">
              {t('nav.home')}
            </Link>
            <Link className="text-white/70 hover:text-white" href="/calculator">
              {t('nav.calculator')}
            </Link>
            <Link className="text-white/70 hover:text-white" href="/contractors">
              {t('nav.contractors')}
            </Link>
            <Link className="text-white/70 hover:text-white" href="/quota">
              {t('nav.quota')}
            </Link>
            <Link className="text-white/70 hover:text-white" href="/forum">
              {t('nav.forum')}
            </Link>
            <Link className="text-white/70 hover:text-white" href="/alerts">
              {t('nav.alerts')}
            </Link>
            <Link className="text-sb-gold hover:text-sb-goldDark" href="/report">
              {t('nav.report')}
            </Link>
            <Link className="text-white/50 hover:text-white/80" href="/preview">
              {t('nav.preview')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">{children}</main>
      <footer className="border-t border-white/10 bg-sb-surface/40 py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-white/45">
          {t('footer.disclaimer')}
        </p>
      </footer>
    </div>
  )
}
