'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import { InfoBanner } from '@/components/ui/InfoBanner'

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
    | 'terms'
    | 'privacy'
    | 'contact'
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
  { href: '/terms', key: 'terms' },
  { href: '/privacy', key: 'privacy' },
  { href: '/contact', key: 'contact' },
  { href: '/offline', key: 'offline' },
]

const VIEWPORTS = ['375', '390', '393', '430', '768', '1024', '1280', '1440'] as const

const AUDIT_CHECKLIST = [
  'One warm solar background and squircle card system',
  'Bottom nav safe-area clearance on iPhone',
  'No horizontal scroll on mobile routes',
  'Calculator completes without API on static export',
  'Report empty + generated states readable',
  'More sheet opens, traps focus, Escape closes',
  'All links work under /Solcore base path',
] as const

export function PreviewPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-readable space-y-6">
      <InfoBanner tone="warning" title="Internal QA hub">
        This page is for testing and design review — not a consumer-facing screen.
      </InfoBanner>

      <div>
        <h1 className="sb-title-2">{t('preview.title')}</h1>
        <p className="sb-body mt-2">{t('preview.subtitle')}</p>
      </div>

      <AppCard variant="solar">
        <h2 className="sb-card-title">{t('preview.pwaTitle')}</h2>
        <p className="sb-body mt-2">{t('preview.pwaBody')}</p>
        <ul className="sb-body mt-3 list-inside list-disc space-y-1">
          <li>{t('preview.pwaStep1')}</li>
          <li>{t('preview.pwaStep2')}</li>
          <li>{t('preview.pwaStep3')}</li>
        </ul>
        <p className="sb-caption mt-4">
          Static export:{' '}
          <code className="text-sb-ink-soft">
            NEXT_PUBLIC_BASE_PATH=/Solcore npm run export:github-pages
          </code>
        </p>
      </AppCard>

      <AppCard variant="flat">
        <h2 className="sb-card-title">Viewport widths to check</h2>
        <p className="sb-caption mt-2">iPhone SE through desktop — iPad uses desktop shell at 768px+.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {VIEWPORTS.map((w) => (
            <span
              key={w}
              className="rounded-sb-pill bg-sb-surface-muted px-3 py-1 text-xs font-bold text-sb-ink-soft"
            >
              {w}px
            </span>
          ))}
        </div>
      </AppCard>

      <AppCard variant="flat">
        <h2 className="sb-card-title">Design audit checklist</h2>
        <ul className="mt-3 space-y-2">
          {AUDIT_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-sb-ink-soft">
              <span className="text-sb-green" aria-hidden>
                □
              </span>
              {item}
            </li>
          ))}
        </ul>
      </AppCard>

      <AppCard variant="flat">
        <h2 className="sb-card-title">{t('preview.routesTitle')}</h2>
        <ul className="mt-3 space-y-2">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={withBasePath(r.href)}
                className="flex min-h-[44px] items-center rounded-sb-md px-3 text-sm font-semibold text-sb-goldDark hover:bg-sb-surface-muted"
              >
                {t(`preview.link.${r.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </AppCard>

      <AppCard variant="warning">
        <h2 className="sb-card-title">Phase 2 ops</h2>
        <p className="sb-body mt-2">
          Forum moderation UI (requires MODERATION_SECRET + service role).
        </p>
        <Link
          href={withBasePath('/preview/moderation')}
          className="mt-3 inline-flex min-h-[44px] items-center rounded-sb-md border border-sb-orange/40 bg-sb-orangeSoft px-4 text-sm font-bold text-sb-orange"
        >
          Open moderation tools →
        </Link>
      </AppCard>
    </div>
  )
}
