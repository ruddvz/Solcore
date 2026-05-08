'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { useCalculatorStore } from '@/store/calculatorStore'
import { getTechnology } from '@/data/technologies'
import { formatCr, formatInr, formatRsLakh, formatUnitsLakh } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { TabBar } from '@/components/ui/TabBar'
import { KV } from '@/components/ui/KV'
import { DonutSvg } from '@/components/charts/DonutSvg'
import { FundingStack } from '@/components/ui/FundingStack'
import {
  getEpcListForState,
  FINANCING_PARTNERS,
  INVERTER_BRANDS,
  PANEL_MANUFACTURERS,
  ROBOT_SYSTEMS,
} from '@/data/suppliers'
import type { RiskLevel, StateInfo, YearlyRow } from '@/types'
import { exportReportElementToPdf, exportTabSequenceToPdf } from '@/lib/exportPdf'

type TabId = 'overview' | 'costs' | 'model' | 'risks' | 'action' | 'suppliers'

const RISK_ROWS: { risk: string; impact: string; mitigation: string }[] = [
  { risk: 'r1', impact: 'r1i', mitigation: 'r1m' },
  { risk: 'r2', impact: 'r2i', mitigation: 'r2m' },
  { risk: 'r3', impact: 'r3i', mitigation: 'r3m' },
  { risk: 'r4', impact: 'r4i', mitigation: 'r4m' },
  { risk: 'r5', impact: 'r5i', mitigation: 'r5m' },
  { risk: 'r6', impact: 'r6i', mitigation: 'r6m' },
  { risk: 'r7', impact: 'r7i', mitigation: 'r7m' },
  { risk: 'r8', impact: 'r8i', mitigation: 'r8m' },
]

function planRiskLevel(stateId: string, index: number): RiskLevel {
  if (index === 0 || index === 1) return 'HIGH'
  if (index === 2) {
    return [
      'rajasthan',
      'madhya-pradesh',
      'uttar-pradesh',
      'bihar',
      'chhattisgarh',
      'jharkhand',
    ].includes(stateId)
      ? 'HIGH'
      : 'MED'
  }
  if (index === 4) return stateId === 'rajasthan' ? 'HIGH' : 'MED'
  if (index === 5) return stateId === 'maharashtra' || stateId === 'karnataka' ? 'HIGH' : 'MED'
  if (index === 3 || index === 6 || index === 7) return 'MED'
  return 'MED'
}

function levelStyle(level: RiskLevel) {
  if (level === 'HIGH') return 'bg-sb-red/20 text-sb-red'
  if (level === 'MED') return 'bg-sb-orange/15 text-sb-orange'
  return 'bg-white/10 text-white/55'
}

function StarRating({ value, label }: { value: number; label: string }) {
  const full = Math.min(5, Math.max(0, Math.round(value)))
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={label}>
      <span className="text-sb-gold">
        {'★'.repeat(full)}
        <span className="text-white/20">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="font-mono text-[11px] text-white/50">{value.toFixed(1)}</span>
    </span>
  )
}

type ModelSortKey = 'year' | 'unitsLakh' | 'grossRevenueRs' | 'omRs' | 'emiRs' | 'netProfitRs' | 'cumulativeRs'

function ModelYearTable({
  yearly,
  footerLabel,
  footerValue,
}: {
  yearly: YearlyRow[]
  footerLabel: string
  footerValue: string
}) {
  const { t } = useTranslation()
  const [sortKey, setSortKey] = useState<ModelSortKey>('year')
  const [sortDesc, setSortDesc] = useState(false)

  const onHeader = (k: ModelSortKey) => {
    if (k === sortKey) setSortDesc((d) => !d)
    else {
      setSortKey(k)
      setSortDesc(false)
    }
  }

  const sorted = useMemo(() => {
    const arr = [...yearly]
    const mul = sortDesc ? -1 : 1
    arr.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === bv) return 0
      return av < bv ? -1 * mul : 1 * mul
    })
    return arr
  }, [yearly, sortKey, sortDesc])

  const th = (k: ModelSortKey, label: string) => (
    <th
      scope="col"
      className="cursor-pointer py-2 pr-2 select-none hover:text-white/90"
      onClick={() => onHeader(k)}
    >
      {label}
      {sortKey === k ? (sortDesc ? ' ▼' : ' ▲') : ''}
    </th>
  )

  return (
    <table className="w-full text-left text-[12.5px]">
      <thead>
        <tr className="border-b border-white/10 sb-overline text-white/40">
          {th('year', t('report.model.colYear'))}
          {th('unitsLakh', t('report.model.colUnits'))}
          {th('grossRevenueRs', t('report.model.colGross'))}
          {th('omRs', t('report.model.colOm'))}
          {th('emiRs', t('report.model.colEmi'))}
          {th('netProfitRs', t('report.model.colNet'))}
          {th('cumulativeRs', t('report.model.colCum'))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr
            key={r.year}
            className={`border-b border-white/5 ${
              r.year === 11 ? 'bg-sb-accent font-semibold text-white' : ''
            }`}
          >
            <td className="py-1.5 pr-2 font-mono font-bold">{r.year}</td>
            <td className="py-1.5 pr-2 font-mono">{r.unitsLakh}</td>
            <td className="py-1.5 pr-2 font-mono">{formatInr(r.grossRevenueRs)}</td>
            <td className="py-1.5 pr-2 font-mono">{formatInr(r.omRs)}</td>
            <td className="py-1.5 pr-2 font-mono">{formatInr(r.emiRs)}</td>
            <td className="py-1.5 pr-2 font-mono text-sb-green">{formatInr(r.netProfitRs)}</td>
            <td className="py-1.5 font-mono text-white/80">{formatInr(r.cumulativeRs)}</td>
          </tr>
        ))}
        <tr className="bg-white/5 font-extrabold">
          <td className="py-2 pr-2" colSpan={5}>
            {footerLabel}
          </td>
          <td className="py-2 font-mono text-sb-gold" colSpan={2}>
            ₹{footerValue}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function ReportPage() {
  const { t } = useTranslation()
  const {
    stateId,
    districtId,
    technologyId,
    getFinancials,
    getResolvedState,
    fetchSolarForSelection,
  } = useCalculatorStore()
  const [tab, setTab] = useState<TabId>('overview')
  const [pdfBusy, setPdfBusy] = useState(false)
  const pdfCaptureRef = useRef<HTMLDivElement>(null)

  const state = getResolvedState()

  useEffect(() => {
    void fetchSolarForSelection()
  }, [fetchSolarForSelection])
  const district = state?.districts.find((d) => d.id === districtId)
  const fin = getFinancials()
  const tech = getTechnology(technologyId)

  const tabs = useMemo(
    () =>
      [
        { id: 'overview' as const, label: t('report.tabs.overview') },
        { id: 'costs' as const, label: t('report.tabs.costs') },
        { id: 'model' as const, label: t('report.tabs.model') },
        { id: 'risks' as const, label: t('report.tabs.risks') },
        { id: 'action' as const, label: t('report.tabs.action') },
        { id: 'suppliers' as const, label: t('report.tabs.suppliers') },
      ] as const,
    [t],
  )

  const modelChartData = useMemo(() => {
    if (!fin) return []
    return fin.yearly.map((r) => ({
      year: r.year,
      cumulativeCr: r.cumulativeRs / 1e7,
    }))
  }, [fin])

  const donutSegments = useMemo(() => {
    if (!fin) return []
    return fin.donutSegments.map((s) => ({
      value: s.amountRs,
      color: s.color,
    }))
  }, [fin])

  const chart40Data = useMemo(() => {
    if (!fin) return []
    return fin.cumulative40.map((d) => ({ year: d.year, cumulativeCr: d.cumulativeRs / 1e7 }))
  }, [fin])

  if (!state || !fin) {
    return (
      <Card>
        <p className="text-white/70">
          Adjust your land area in the calculator (must be greater than zero).
        </p>
        <Link className="mt-4 inline-block font-bold text-sb-gold" href="/calculator">
          ← {t('nav.calculator')}
        </Link>
      </Card>
    )
  }

  const pdfBaseName = `SolarBharat-${state.name}-${district?.name ?? 'district'}-${tech.label}`

  async function handlePdfCurrentTab() {
    const el = pdfCaptureRef.current
    if (!el || pdfBusy) return
    setPdfBusy(true)
    try {
      await exportReportElementToPdf(el, `${pdfBaseName}-tab`)
    } finally {
      setPdfBusy(false)
    }
  }

  async function handlePdfFullReport() {
    const el = pdfCaptureRef.current
    if (!el || pdfBusy) return
    const tabIds: TabId[] = ['overview', 'costs', 'model', 'risks', 'action', 'suppliers']
    setPdfBusy(true)
    try {
      await exportTabSequenceToPdf(el, tabIds, (id) => setTab(id as TabId), 400, pdfBaseName)
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">{t('report.title')}</h1>
          <p className="mt-1 text-sm text-white/55">
            {district?.name}, {state.name} · {tech.label}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={pdfBusy}
            onClick={() => void handlePdfCurrentTab()}
            className="rounded-xl border border-sb-gold/40 bg-sb-gold/10 px-4 py-2 text-sm font-bold text-sb-gold hover:bg-sb-gold/20 disabled:opacity-50"
          >
            {pdfBusy ? t('report.pdf.downloading') : t('report.pdf.currentTab')}
          </button>
          <button
            type="button"
            disabled={pdfBusy}
            onClick={() => void handlePdfFullReport()}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/85 hover:border-white/30 disabled:opacity-50"
          >
            {pdfBusy ? t('report.pdf.downloading') : t('report.pdf.fullReport')}
          </button>
          <Link
            href="/calculator"
            className="shrink-0 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/75 hover:border-white/30"
          >
            ← {t('report.back')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <Pill value={formatUnitsLakh(fin.year1UnitsLakh)} label={t('report.pills.y1')} />
        <Pill value={formatCr(fin.totalCapexRs)} label={t('report.pills.capex')} />
        <Pill value={formatCr(fin.totalCashRequiredRs)} label={t('report.pills.cash')} />
        <Pill value={formatCr(fin.subsidyAmountRs)} label={t('report.pills.subsidy')} />
        <Pill value={formatCr(fin.loanAmountRs)} label={t('report.pills.loan')} />
        <Pill value={formatInr(fin.monthlyEmiRs)} label={t('report.pills.emi')} />
        <Pill value={`${fin.returnMultiple25}×`} label={t('report.pills.multiple')} />
      </div>

      <TabBar tabs={[...tabs]} active={tab} onChange={(id) => setTab(id as TabId)} />

      <div ref={pdfCaptureRef} className="space-y-6">
      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-2" data-report-section="overview">
          <Card>
            <div className="sb-overline text-white/45">
              {t('report.overview.system')}
            </div>
            <div className="mt-3 space-y-1">
              <KV label={t('report.overview.mwAc')} value={`${fin.systemMwAc} MW`} variant="highlight" />
              <KV label={t('report.overview.mwDc')} value={`${fin.systemMwDc} MW`} />
              <KV label={t('report.overview.kwp')} value={formatInr(fin.systemKwp)} />
              <KV label={t('report.overview.panels')} value={formatInr(fin.panelCountApprox)} />
              <KV label={t('report.overview.inverters')} value={formatInr(fin.inverterCountApprox)} />
              <KV label={t('report.overview.techBadge')} value={t(`calc.verdict.${tech.verdict}`)} />
              <KV label={t('report.overview.dcac')} value={fin.dcAcRatio.toFixed(2)} />
            </div>
          </Card>
          <Card accent="blue">
            <div className="sb-overline text-white/45">
              {t('report.overview.climate')}
            </div>
            <div className="mt-3 space-y-1">
              <KV label={t('report.overview.ghi')} value={`${state.ghiKwhM2Day} kWh/m²/day`} />
              <KV label={t('report.overview.peakSun')} value={`${state.peakSunHours.toFixed(2)} h`} />
              {state.effectivePerformanceRatio !== undefined && (
                <KV
                  label={t('report.overview.effectivePr')}
                  value={`${(state.effectivePerformanceRatio * 100).toFixed(1)}%`}
                />
              )}
              <KV label={t('report.overview.tariff')} value={`₹${fin.tariffMidRs.toFixed(2)}`} />
              <KV label={t('report.overview.subsidyPct')} value={`${state.subsidyPct}%`} />
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/50">{state.monsoonNote}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-white/50">{state.gridQuality}</p>
          </Card>

          <Card className="lg:col-span-2">
            <div className="sb-overline text-white/45">
              {t('report.overview.chart40')}
            </div>
            <div className="mt-4 w-full min-w-0">
              <ResponsiveContainer width="100%" height={288} minWidth={0}>
                <LineChart data={chart40Data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `₹${v}`}
                    label={{ value: 'Cr', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v) => {
                      const n = typeof v === 'number' ? v : Number(v)
                      return [`₹${(n * 1e7).toLocaleString('en-IN')}`, t('report.overview.chart40Cum')]
                    }}
                  />
                  <Line type="monotone" dataKey="cumulativeCr" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  <ReferenceLine
                    x={11}
                    stroke="rgba(255,255,255,0.35)"
                    strokeDasharray="4 4"
                    label={{ value: 'Yr 11', fill: '#94a3b8', fontSize: 10 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/45">{t('report.overview.chart40Axis')}</p>
          </Card>

          <Card>
            <KV
              label={t('report.overview.mBreakeven')}
              value={fin.breakevenYear ? `Year ${fin.breakevenYear}` : '—'}
              variant="highlight"
            />
            <KV
              label={t('report.overview.mCashBack')}
              value={fin.cashRecoveryYear ? `Year ${fin.cashRecoveryYear}` : '—'}
            />
            <KV
              label={t('report.overview.mPostLoan')}
              value={`₹${formatInr(fin.postLoanMonthlyIncomeRs)} / mo`}
            />
            <KV
              label={t('report.overview.mNet25')}
              value={formatCr(fin.netProfit25YrsRs)}
              variant="warn"
            />
          </Card>

          <Card accent="green">
            <div className="sb-overline text-sb-orange">
              {t('report.overview.warnings')}
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-white/70">
              <li>
                {t('report.overview.wCash', {
                  amountL: formatRsLakh(fin.totalCashRequiredRs),
                  amount: `₹${formatInr(fin.totalCashRequiredRs)}`,
                })}
              </li>
              <li>
                {t('report.overview.wPpaLock', { years: state.ppaLockYearsTypical ?? 25 })}
              </li>
              <li>{t('report.overview.wTx')}</li>
              <li>
                {state.id === 'rajasthan'
                  ? t('report.overview.wDustRj')
                  : t('report.overview.wDust')}
              </li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'costs' && (
        <div className="grid gap-4 lg:grid-cols-2" data-report-section="costs">
          <Card>
            <div className="sb-overline text-white/45">
              {t('report.costs.donut')}
            </div>
            <div className="mt-4">
              <DonutSvg segments={donutSegments} />
            </div>
            {fin.donutSegments.length > 0 ? (
              <ul className="mt-4 grid gap-2 text-[11px] text-white/65 sm:grid-cols-2">
                {fin.donutSegments.map((s) => (
                  <li key={s.key} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
                    <span className="font-bold text-white/80">{t(s.labelKey)}</span>
                    <span className="ml-auto font-mono text-white/55">₹{formatInr(s.amountRs)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
          <Card>
            <div className="sb-overline text-white/45">
              {t('report.costs.funding')}
            </div>
            <div className="mt-4">
              <FundingStack
                parts={[
                  {
                    label: t('report.costs.govtWithPct', { pct: state.subsidyPct }),
                    amountRs: fin.subsidyAmountRs,
                    color: '#22c55e',
                  },
                  { label: t('report.costs.loanAfterSubsidy'), amountRs: fin.loanAmountRs, color: '#0ea5e9' },
                  { label: t('report.costs.youEquity'), amountRs: fin.cashEquityRs, color: '#f97316' },
                ]}
              />
              <div className="mt-4 space-y-1 text-[14px] leading-snug text-white/55">
                <div>
                  {t('report.costs.govt')}: <b className="text-white">₹{formatInr(fin.subsidyAmountRs)}</b>
                </div>
                <div>
                  {t('report.costs.loan')}: <b className="text-white">₹{formatInr(fin.loanAmountRs)}</b>
                </div>
                <div>
                  {t('report.costs.you')}: <b className="text-white">₹{formatInr(fin.cashEquityRs)}</b> +{' '}
                  <b className="text-sb-orange">₹{formatInr(fin.operatingReserveRs)}</b> reserve
                </div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="sb-overline text-white/45">
              {t('report.costs.table')}
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-white/10 sb-overline text-white/40">
                    <th className="py-2 pr-4">{t('report.costs.colItem')}</th>
                    <th className="py-2 text-right">{t('report.costs.colAmount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fin.costLines.map((c) => (
                    <tr key={c.key} className="border-b border-white/5">
                      <td className="py-2 pr-4 text-white/80">{t(c.labelKey)}</td>
                      <td className="py-2 text-right font-mono font-bold">
                        {formatInr(c.amountRs)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 text-white/80">{t('report.costs.landRow')}</td>
                    <td className="py-2 text-right font-mono font-bold text-sb-green">₹0</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-extrabold text-white">Total</td>
                    <td className="py-2 text-right font-mono font-extrabold text-sb-gold">
                      {formatInr(fin.totalCapexRs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/45">{t('report.costs.landFree')}</p>
          </Card>

          <Card className="lg:col-span-2" accent="green">
            <div className="sb-overline text-white/45">
              {t('report.costs.reality')}
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-white/70">
              <li>{t('report.costs.subsidyDelay')}</li>
              <li>{t('report.costs.reserve')}</li>
            </ul>
            <div className="mt-4 sb-overline text-white/45">
              {t('report.costs.benefits')}
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/60">
              <li>{t('report.costs.gst')}</li>
              <li>{t('report.costs.ad')}</li>
              <li>{t('report.costs.rec')}</li>
              <li>{t('report.costs.nabard')}</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'model' && (
        <div className="space-y-4" data-report-section="model">
          <Card>
            <div className="sb-overline text-white/45">
              {t('report.model.chart')}
            </div>
            <div className="mt-4 w-full min-w-0">
              <ResponsiveContainer width="100%" height={256} minWidth={0}>
                <LineChart data={modelChartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v) => {
                      const n = typeof v === 'number' ? v : Number(v)
                      return [`₹${(n * 1e7).toLocaleString('en-IN')}`, t('report.overview.chart40Cum')]
                    }}
                  />
                  <Line type="monotone" dataKey="cumulativeCr" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <ReferenceLine
                    x={11}
                    stroke="rgba(255,255,255,0.35)"
                    strokeDasharray="4 4"
                    label={{ value: 'Yr 11', fill: '#94a3b8', fontSize: 10 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/45">{t('report.model.note')}</p>
          </Card>

          <Card>
            <div className="sb-overline text-white/45">
              {t('report.model.table')}
            </div>
            <div className="mt-3 overflow-x-auto">
              <ModelYearTable
                yearly={fin.yearly}
                footerLabel={t('report.model.footer')}
                footerValue={formatInr(fin.netProfit25YrsRs)}
              />
            </div>
          </Card>
        </div>
      )}

      {tab === 'risks' && (
        <Card data-report-section="risks">
          <div className="sb-overline text-white/45">
            {t('report.risks.title')}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="sb-overline text-white/35">Risk</div>
            <div className="sb-overline text-white/35">Impact</div>
            <div className="sb-overline text-white/35">Mitigation</div>
          </div>
          <div className="mt-2 space-y-3">
            {RISK_ROWS.map((row, idx) => {
              const level = planRiskLevel(state.id, idx)
              return (
              <div
                key={row.risk}
                className="grid gap-2 rounded-xl border border-white/10 bg-sb-bg/40 p-3 md:grid-cols-3"
              >
                <div>
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold ${levelStyle(level)}`}>
                    {level}
                  </span>
                  <div className="mt-2 text-sm font-bold text-white">{t(`report.risks.${row.risk}`)}</div>
                </div>
                <div className="text-sm text-white/65">{t(`report.risks.${row.impact}`)}</div>
                <div className="text-sm text-white/65">{t(`report.risks.${row.mitigation}`)}</div>
              </div>
              )
            })}
          </div>
        </Card>
      )}

      {tab === 'action' && <ActionPlanTab state={state} />}

      {tab === 'suppliers' && <SuppliersTab stateId={stateId} />}
      </div>
    </div>
  )
}

function ActionPlanTab({ state }: { state: StateInfo }) {
  const { t } = useTranslation()
  const docs = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10'] as const
  const [done, setDone] = useState<Record<string, boolean>>({})

  const phases = [
    { title: 'p1', items: ['p1a', 'p1b', 'p1c'] as const, tone: 'border-sb-gold/40 bg-sb-gold/5' },
    { title: 'p2', items: ['p2a', 'p2b'] as const, tone: 'border-white/10' },
    { title: 'p3', items: ['p3a', 'p3b'] as const, tone: 'border-white/10' },
    { title: 'p4', items: ['p4a', 'p4b'] as const, tone: 'border-sb-blue/30 bg-sb-blue/5' },
    { title: 'p5', items: ['p5a', 'p5b'] as const, tone: 'border-white/10' },
    { title: 'p6', items: ['p6a', 'p6b'] as const, tone: 'border-sb-green/30 bg-sb-green/5' },
  ] as const

  return (
    <div className="space-y-4" data-report-section="action">
      <Card>
        <div className="sb-overline text-white/45">{t('report.action.title')}</div>
        <div className="mt-4 space-y-3">
          {phases.map((ph) => (
            <div key={ph.title} className={`rounded-xl border p-4 ${ph.tone}`}>
              <div className="sb-overline text-sb-gold">
                {t(`report.action.${ph.title}`)}
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/70">
                {ph.items.map((k) => (
                  <li key={k}>
                    {t(`report.action.${k}`, {
                      nodal: state.nodalAgency,
                      state: state.name,
                      discom: state.discom,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="blue">
        <div className="sb-overline text-white/45">
          {t('report.action.contacts')}
        </div>
        <div className="mt-3 space-y-2 text-sm text-white/75">
          <div>
            <span className="font-bold text-white">{t('report.action.nodalLabel')}:</span> {state.nodalAgency}
          </div>
          {state.nodalPortalUrl ? (
            <div>
              <span className="font-bold text-white">{t('report.action.portalLabel')}:</span>{' '}
              <a
                href={state.nodalPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sb-blue underline-offset-2 hover:underline"
              >
                {state.nodalPortalUrl.replace(/^https?:\/\//i, '')}
              </a>
            </div>
          ) : null}
          {state.nodalPhoneHint ? (
            <p className="text-[14px] leading-relaxed text-white/50">{state.nodalPhoneHint}</p>
          ) : (
            <p className="text-[14px] leading-relaxed text-white/45">{t('report.action.phoneVerify')}</p>
          )}
          <div>
            <span className="font-bold text-white">{t('report.action.discomLabel')}:</span> {state.discom}
          </div>
          <div>
            <span className="font-bold text-white">Bank:</span> {t('report.action.bank')}
          </div>
        </div>
      </Card>

      <Card>
        <div className="sb-overline text-white/45">
          {t('report.action.docsTitle')}
        </div>
        <ul className="mt-3 space-y-2">
          {docs.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-white/75">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-sb-gold"
                checked={!!done[d]}
                onChange={(e) => setDone((prev) => ({ ...prev, [d]: e.target.checked }))}
              />
              <span>{t(`report.action.${d}`)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <AgrivoltaicsSection stateId={state.id} />
    </div>
  )
}

function AgrivoltaicsSection({ stateId }: { stateId: string }) {
  const { t } = useTranslation()
  const cropsKey =
    stateId === 'gujarat' ? 'cropsGj' : stateId === 'rajasthan' ? 'cropsRj' : 'cropsDef'
  return (
    <Card accent="green">
      <div className="sb-overline text-sb-greenMuted">
        {t('report.agri.title')}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-[11px] font-bold uppercase text-white/40">{t('report.agri.layout')}</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/70">
            <li>{t('report.agri.l1')}</li>
            <li>{t('report.agri.l2')}</li>
            <li>{t('report.agri.l3')}</li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase text-white/40">{t('report.agri.crops')}</div>
          <p className="mt-2 text-sm text-white/70">{t(`report.agri.${cropsKey}`)}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-white/65">
        <div>
          <span className="font-bold text-white">{t('report.agri.income')}:</span> {t('report.agri.incomeNote')}
        </div>
        <div>
          <span className="font-bold text-white">{t('report.agri.capex')}:</span> {t('report.agri.capexNote')}
        </div>
        <div className="text-[11px] font-bold uppercase text-white/40">{t('report.agri.phases')}</div>
        <ul className="list-disc space-y-1 pl-4">
          <li>{t('report.agri.ph1')}</li>
          <li>{t('report.agri.ph2')}</li>
          <li>{t('report.agri.ph3')}</li>
        </ul>
        <p className="text-sb-orange">{t('report.agri.na')}</p>
      </div>
    </Card>
  )
}

function SuppliersTab({ stateId }: { stateId: string }) {
  const { t } = useTranslation()
  const epcs = getEpcListForState(stateId)

  return (
    <div className="space-y-4" data-report-section="suppliers">
      <Card>
        <div className="sb-overline text-white/45">{t('report.suppliers.epc')}</div>
        {epcs.length === 0 ? (
          <p className="mt-2 text-sm text-white/55">{t('report.suppliers.epcPlaceholder')}</p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {epcs.map((e) => (
            <li
              key={e.name}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-sb-bg/50 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="font-bold text-white">{e.name}</span>
                <StarRating
                  value={e.rating}
                  label={t('report.suppliers.ratingAria', { name: e.name })}
                />
                <span className="w-fit rounded bg-sb-green/20 px-2 py-0.5 text-[10px] font-extrabold text-sb-green">
                  {t('report.suppliers.verified')}
                </span>
              </div>
              <a className="shrink-0 text-xs text-sb-blue hover:underline" href={e.url} target="_blank" rel="noreferrer">
                {e.url.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="sb-overline text-white/45">{t('report.suppliers.panels')}</div>
        <p className="mt-1 text-[14px] leading-relaxed text-white/45">{t('report.suppliers.almm')}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {PANEL_MANUFACTURERS.map((p) => (
            <li key={p.name} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 py-2">
              <span className="font-bold text-white">{p.name}</span>
              <span className="text-white/55">
                {t(p.locationKey)} · {t(p.techKey)}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-sb-gold/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-sb-gold">
                  ALMM
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60">
                  {p.tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="sb-overline text-white/45">{t('report.suppliers.inverters')}</div>
        <ul className="mt-3 space-y-2">
          {INVERTER_BRANDS.map((inv) => (
            <li key={inv.name} className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-bold text-white">{inv.name}</span>
              <span className="text-white/55">{inv.model}</span>
              <span className="text-[11px] text-sb-blue">
                {t('report.suppliers.warranty')}: {inv.warranty}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="sb-overline text-white/45">{t('report.suppliers.robots')}</div>
        <ul className="mt-3 space-y-2">
          {ROBOT_SYSTEMS.map((r) => (
            <li key={r.name} className="rounded-xl border border-white/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white">{r.name}</span>
                {r.rec && (
                  <span className="rounded bg-sb-purple/20 px-2 py-0.5 text-[10px] font-extrabold text-sb-purple">
                    {t('report.suppliers.recommended')}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[14px] leading-snug text-white/55">
                {t(r.capitalKey)} · {t(r.runKey)}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card accent="green">
        <div className="sb-overline text-white/45">{t('report.suppliers.finance')}</div>
        <ul className="mt-3 space-y-2 text-sm">
          {FINANCING_PARTNERS.map((f) => (
            <li key={f.bankKey} className="flex flex-wrap justify-between gap-2 border-b border-white/5 py-2">
              <span className="font-bold text-white">{t(f.bankKey)}</span>
              <span className="text-sb-gold">{f.rate}</span>
              <span className="text-white/55">{t(f.tenureKey)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
