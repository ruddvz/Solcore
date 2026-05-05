import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Pill } from '../components/ui/Pill'
import { STATES } from '../data/states'

const FEATURES = [
  { icon: '📍', t: 'f1t', d: 'f1d' },
  { icon: '🧮', t: 'f2t', d: 'f2d' },
  { icon: '⚡', t: 'f3t', d: 'f3d' },
  { icon: '💰', t: 'f4t', d: 'f4d' },
  { icon: '📈', t: 'f5t', d: 'f5d' },
  { icon: '⚠️', t: 'f6t', d: 'f6d' },
  { icon: '✅', t: 'f7t', d: 'f7d' },
  { icon: '🏭', t: 'f8t', d: 'f8d' },
] as const

const PHASE2 = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Haryana',
  'Punjab',
  'Odisha',
]

export function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-14">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-sb-surface to-sb-bg p-8 md:p-12">
        <h1 className="max-w-3xl text-balance font-black tracking-tight text-white [font-size:clamp(28px,5vw,50px)]">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-white/60">{t('home.heroSubtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/calculator"
            className="inline-flex items-center justify-center rounded-xl bg-sb-gold px-6 py-3 text-sm font-extrabold text-sb-bg shadow-lg shadow-sb-gold/20 transition hover:bg-sb-goldDark"
          >
            {t('home.cta')}
          </Link>
          <Link
            to="/report"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/80 hover:border-white/30 hover:text-white"
          >
            {t('nav.report')}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <Pill value="6" label={t('home.stat1')} />
          <Pill value="25" label={t('home.stat2')} />
          <Pill value="40" label={t('home.stat3')} />
          <Pill value="78%" label={t('home.stat4')} />
          <Pill value="₹0" label={t('home.stat5')} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-white">{t('home.featuresTitle')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-white/10 bg-sb-surface/60 p-4 transition hover:border-sb-gold/30"
            >
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-2 text-sm font-extrabold text-white">{t(`home.${f.t}`)}</div>
              <p className="mt-1 text-sm text-white/55">{t(`home.${f.d}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-white">{t('home.coverageTitle')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-sb-green/30 bg-sb-accent/30 p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-sb-greenMuted">
              {t('home.live')}
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {STATES.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full bg-sb-green/15 px-3 py-1 text-xs font-bold text-sb-green"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-sb-surface/50 p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-white/45">
              {t('home.soon')}
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PHASE2.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/45"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
