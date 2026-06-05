'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'
import { listGeographyStates } from '@/lib/region'
import { Pill } from '@/components/ui/Pill'
import { ButtonLink } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import {
  IconCalculator,
  IconContractors,
  IconDistrict,
  IconReport,
} from '@/components/ui/SolarIcons'

const FEATURES = [
  { Icon: IconDistrict, t: 'featureDistrict', d: 'featureDistrictDesc' },
  { Icon: IconCalculator, t: 'featureCost', d: 'featureCostDesc' },
  { Icon: IconReport, t: 'featureReport', d: 'featureReportDesc' },
  { Icon: IconContractors, t: 'featureContractors', d: 'featureContractorsDesc' },
] as const

const AUDIENCE = [
  { t: 'audienceOwners', d: 'audienceOwnersDesc' },
  { t: 'audienceFarmers', d: 'audienceFarmersDesc' },
  { t: 'audienceBusiness', d: 'audienceBusinessDesc' },
  { t: 'audienceContractors', d: 'audienceContractorsDesc' },
] as const

const ALL_STATES = listGeographyStates()
const stateCount = ALL_STATES.length
const districtCount = ALL_STATES.reduce((n, s) => n + s.districts.length, 0)

export function HomePage() {
  const { t } = useTranslation()
  const [stateId, setStateId] = useState(ALL_STATES[0]?.id ?? '')
  const [districtId, setDistrictId] = useState(ALL_STATES[0]?.districts[0]?.id ?? '')
  const [coverageQuery, setCoverageQuery] = useState('')

  const geoState = ALL_STATES.find((s) => s.id === stateId)
  const districts = geoState?.districts ?? []

  const calcHref = useMemo(() => {
    const q = new URLSearchParams()
    if (stateId) q.set('stateId', stateId)
    if (districtId) q.set('districtId', districtId)
    const qs = q.toString()
    return withBasePath(`/calculator${qs ? `?${qs}` : ''}`)
  }, [stateId, districtId])

  const filteredStates = useMemo(() => {
    const q = coverageQuery.trim().toLowerCase()
    if (!q) return ALL_STATES
    return ALL_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.districts.some((d) => d.name.toLowerCase().includes(q)),
    )
  }, [coverageQuery])

  return (
    <div className="space-y-14">
      <section className="rounded-[var(--radius-lg)] border border-white/10 bg-gradient-to-br from-sb-surface to-sb-bg p-6 md:p-12">
        <p className="sb-overline text-sb-gold">{t('home.trustPill')}</p>
        <h1 className="font-heading mt-3 max-w-3xl text-balance font-extrabold tracking-tight text-white [font-size:clamp(28px,5vw,44px)] leading-[1.1]">
          {t('home.heroTitle')}
        </h1>
        <p className="sb-body mt-4 max-w-2xl text-pretty text-white/60">{t('home.heroSubtitle')}</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="sb-overline text-white/70">{t('home.districtStart')}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Select
              id="home-state"
              label={t('calc.state')}
              value={stateId}
              onChange={(id) => {
                setStateId(id)
                const next = ALL_STATES.find((s) => s.id === id)
                setDistrictId(next?.districts[0]?.id ?? '')
              }}
              options={ALL_STATES.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Select
              id="home-district"
              label={t('calc.district')}
              value={districtId}
              onChange={setDistrictId}
              options={districts.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={calcHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-sb-gold px-6 py-3 text-sm font-extrabold text-sb-bg shadow-lg shadow-sb-gold/20 transition hover:bg-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
          >
            {t('home.cta')}
          </Link>
          <ButtonLink href="/contractors" variant="secondary">
            {t('home.ctaSecondary')}
          </ButtonLink>
          <ButtonLink href="/report" variant="ghost">
            {t('home.ctaSample')}
          </ButtonLink>
        </div>

        <p className="mt-4 text-xs text-white/65">
          {t('home.statStates')} · {t('home.trustTitle')} · {t('home.featureReport')}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Pill value={String(stateCount)} label={t('home.statStates')} />
          <Pill value={String(districtCount)} label={t('home.statDistricts')} />
          <Pill value="25" label={t('home.stat2')} />
          <Pill value="78%" label={t('home.stat4')} />
        </div>
      </section>

      <section>
        <h2 className="font-heading text-[22px] font-bold text-white">{t('home.featuresTitle')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ Icon, t: titleKey, d }) => (
            <div
              key={titleKey}
              className="rounded-[20px] border border-white/10 bg-sb-surface/60 p-5 transition hover:border-sb-gold/30"
            >
              <div className="text-sb-gold">
                <Icon />
              </div>
              <div className="mt-3 font-heading text-[15px] font-bold leading-snug text-white">
                {t(`home.${titleKey}`)}
              </div>
              <p className="mt-1 text-[14px] leading-relaxed text-white/70">{t(`home.${d}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-[22px] font-bold text-white">{t('home.trustTitle')}</h2>
        <p className="sb-body mt-2 max-w-2xl text-white/70">{t('home.trustBody')}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {AUDIENCE.map(({ t: titleKey, d }) => (
            <div key={titleKey} className="rounded-xl border border-white/10 bg-sb-surface/40 p-4">
              <div className="font-heading text-[15px] font-bold text-white">{t(`home.${titleKey}`)}</div>
              <p className="mt-1 text-sm text-white/70">{t(`home.${d}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-[22px] font-bold text-white">{t('home.coverageTitle')}</h2>
        <p className="sb-body mt-2 text-white/70">
          {t('home.coverageAll', { states: stateCount, districts: districtCount })}
        </p>
        <label className="mt-4 block">
          <span className="sr-only">{t('home.searchCoverage')}</span>
          <input
            type="search"
            value={coverageQuery}
            onChange={(e) => setCoverageQuery(e.target.value)}
            placeholder={t('home.searchCoverage')}
            className="min-h-[48px] w-full rounded-xl border border-white/15 bg-sb-bg px-4 text-base text-white outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
          />
        </label>
        <ul className="mt-4 space-y-2">
          {filteredStates.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-white/10 bg-sb-surface/50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white">{s.name}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white/60">
                  {s.districts.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/65">
                {s.districts
                  .slice(0, 6)
                  .map((d) => d.name)
                  .join(' · ')}
                {s.districts.length > 6 ? '…' : ''}
              </p>
              <Link
                href={withBasePath(`/calculator?stateId=${s.id}`)}
                className="mt-2 inline-flex min-h-[44px] items-center text-xs font-bold text-sb-gold hover:text-sb-goldDark"
              >
                {t('home.viewDistricts')} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
