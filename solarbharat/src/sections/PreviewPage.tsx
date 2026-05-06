'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const ROUTES: {
  href: string
  key:
    | 'home'
    | 'calculator'
    | 'report'
    | 'contractors'
    | 'quota'
    | 'forum'
    | 'plan'
    | 'quotes'
    | 'phase3'
    | 'reviews'
    | 'financing'
    | 'alerts'
    | 'offline'
}[] = [
  { href: '/', key: 'home' },
  { href: '/calculator', key: 'calculator' },
  { href: '/report', key: 'report' },
  { href: '/contractors', key: 'contractors' },
  { href: '/quota', key: 'quota' },
  { href: '/forum', key: 'forum' },
  { href: '/plan', key: 'plan' },
  { href: '/quotes', key: 'quotes' },
  { href: '/phase3', key: 'phase3' },
  { href: '/reviews/submit', key: 'reviews' },
  { href: '/financing/interest', key: 'financing' },
  { href: '/alerts', key: 'alerts' },
  { href: '/offline', key: 'offline' },
]

export function PreviewPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">{t('preview.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">{t('preview.subtitle')}</p>
      </div>

      <div className="rounded-2xl border border-sb-gold/25 bg-sb-surface/60 p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-sb-gold">{t('preview.pwaTitle')}</h2>
        <p className="mt-2 text-sm text-white/70">{t('preview.pwaBody')}</p>
        <ul className="mt-3 list-inside list-disc text-sm text-white/55">
          <li>{t('preview.pwaStep1')}</li>
          <li>{t('preview.pwaStep2')}</li>
          <li>{t('preview.pwaStep3')}</li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-white/45">{t('preview.routesTitle')}</h2>
        <ul className="mt-3 space-y-2">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="inline-flex w-full max-w-md items-center justify-between rounded-xl border border-white/10 bg-sb-bg px-4 py-3 text-sm font-bold text-white transition hover:border-sb-gold/40 hover:text-sb-gold"
              >
                <span>{t(`preview.link.${r.key}`)}</span>
                <span className="font-mono text-xs text-white/40">{r.href}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
