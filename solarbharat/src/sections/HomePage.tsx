'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withBasePath } from '@/lib/publicBasePath'
import { listGeographyStates } from '@/lib/region'
import { AppCard } from '@/components/ui/AppCard'
import { ButtonLink } from '@/components/ui/Button'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { MetricCard } from '@/components/ui/MetricCard'
import { Select } from '@/components/ui/Select'
import {
  IconContractors,
  IconReport,
} from '@/components/ui/SolarIcons'

const HOW_IT_WORKS = [
  { step: '1', titleKey: 'howStep1Title', bodyKey: 'howStep1Body' },
  { step: '2', titleKey: 'howStep2Title', bodyKey: 'howStep2Body' },
  { step: '3', titleKey: 'howStep3Title', bodyKey: 'howStep3Body' },
] as const

const ALL_STATES = listGeographyStates()
const stateCount = ALL_STATES.length
const districtCount = ALL_STATES.reduce((n, s) => n + s.districts.length, 0)
const COVERAGE_PREVIEW = 6

export function HomePage() {
  const { t } = useTranslation()
  const [stateId, setStateId] = useState(ALL_STATES[0]?.id ?? '')
  const [districtId, setDistrictId] = useState(ALL_STATES[0]?.districts[0]?.id ?? '')
  const [coverageQuery, setCoverageQuery] = useState('')
  const [coverageExpanded, setCoverageExpanded] = useState(false)

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

  const visibleStates = coverageExpanded ? filteredStates : filteredStates.slice(0, COVERAGE_PREVIEW)

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <AppCard variant="glass" className="mt-3 border-[var(--sb-line-glass)] p-5 md:rounded-[34px] md:p-6">
          <p className="sb-overline text-sb-goldDark">{t('home.trustPill')}</p>
          <h1 className="sb-title-1 mt-3 max-w-3xl text-balance">{t('home.heroTitle')}</h1>
          <p className="sb-body-lg mt-4 max-w-2xl text-pretty">{t('home.heroSubtitle')}</p>

          <div className="mt-5 rounded-sb-lg border border-[var(--sb-line)] bg-sb-card-strong p-4">
            <p className="sb-overline text-sb-muted">{t('home.districtStart')}</p>
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
                disabled={!stateId}
                onChange={setDistrictId}
                options={districts.map((d) => ({ value: d.id, label: d.name }))}
                hint={t('home.districtHint')}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={calcHref}
              className="sb-btn-primary inline-flex min-h-[54px] items-center justify-center rounded-sb-md px-5 text-base font-bold text-sb-ink transition hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
            >
              {t('home.cta')}
            </Link>
            <ButtonLink href="/report?sample=1" variant="secondary" size="lg">
              {t('home.ctaSample')}
            </ButtonLink>
          </div>

          <InfoBanner tone="legal" className="mt-4" title={t('home.estimateTitle')}>
            {t('home.estimateNote')}
          </InfoBanner>
        </AppCard>

        <AppCard variant="solar" className="lg:mt-3">
          <p className="sb-overline">{t('home.insightTitle')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard label={t('home.statDistricts')} value={String(districtCount)} />
            <MetricCard label={t('home.statStates')} value={String(stateCount)} />
            <MetricCard label={t('home.statData')} value="NASA" helper={t('home.statDataUnit')} />
          </div>
        </AppCard>
      </section>

      <section aria-labelledby="home-how-title">
        <h2 id="home-how-title" className="sb-title-2">
          {t('home.howTitle')}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, titleKey, bodyKey }) => (
            <AppCard key={step} variant="flat" className="p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-sb-pill bg-sb-goldSoft text-sm font-bold text-sb-ink">
                {step}
              </span>
              <h3 className="sb-card-title mt-3">{t(`home.${titleKey}`)}</h3>
              <p className="sb-body mt-1">{t(`home.${bodyKey}`)}</p>
            </AppCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-trust-title">
        <h2 id="home-trust-title" className="sb-title-2">
          {t('home.trustTitle')}
        </h2>
        <p className="sb-body mt-2 max-w-readable">{t('home.trustBody')}</p>
      </section>

      <section aria-labelledby="home-coverage-title">
        <h2 id="home-coverage-title" className="sb-title-2">
          {t('home.coverageTitle')}
        </h2>
        <p className="sb-body mt-2 text-sb-muted">
          {t('home.coverageAll', { states: stateCount, districts: districtCount })}
        </p>
        <label className="mt-4 block">
          <span className="sr-only">{t('home.searchCoverage')}</span>
          <input
            type="search"
            value={coverageQuery}
            onChange={(e) => setCoverageQuery(e.target.value)}
            placeholder={t('home.searchCoverage')}
            className="min-h-[52px] w-full rounded-sb-md border border-[var(--sb-line-strong)] bg-[rgba(255,255,255,0.78)] px-4 text-base text-sb-ink outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
          />
        </label>
        <ul className="mt-4 space-y-2">
          {visibleStates.map((s) => (
            <li key={s.id}>
              <AppCard variant="flat" className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-sb-ink">{s.name}</span>
                  <span className="rounded-sb-pill bg-sb-surface-muted px-2 py-0.5 text-xs font-bold text-sb-muted">
                    {s.districts.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-sb-muted">
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
              </AppCard>
            </li>
          ))}
        </ul>
        {filteredStates.length > COVERAGE_PREVIEW ? (
          <button
            type="button"
            className="mt-3 min-h-[44px] text-sm font-bold text-sb-goldDark hover:text-sb-ink"
            onClick={() => setCoverageExpanded((v) => !v)}
          >
            {coverageExpanded ? t('home.viewLessCoverage') : t('home.viewAllCoverage')}
          </button>
        ) : null}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <AppCard variant="interactive" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sb-gold">
            <IconReport className="h-6 w-6" />
            <h3 className="sb-card-title">{t('home.previewReportTitle')}</h3>
          </div>
          <p className="sb-body">{t('home.previewReportBody')}</p>
          <ButtonLink href="/report?sample=1" variant="secondary" className="mt-auto self-start">
            {t('home.ctaSample')}
          </ButtonLink>
        </AppCard>
        <AppCard variant="interactive" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sb-gold">
            <IconContractors className="h-6 w-6" />
            <h3 className="sb-card-title">{t('home.previewContractorsTitle')}</h3>
          </div>
          <p className="sb-body">{t('home.previewContractorsBody')}</p>
          <ButtonLink href="/contractors" variant="secondary" className="mt-auto self-start">
            {t('home.ctaSecondary')}
          </ButtonLink>
        </AppCard>
      </section>

      <footer className="border-t border-[var(--sb-line)] pt-6 pb-2 text-center lg:hidden">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-sb-muted">
          <Link href={withBasePath('/terms')}>{t('footer.terms')}</Link>
          <Link href={withBasePath('/privacy')}>{t('footer.privacy')}</Link>
        </div>
        <p className="sb-caption mx-auto mt-3 max-w-readable">{t('footer.disclaimer')}</p>
      </footer>
    </div>
  )
}
