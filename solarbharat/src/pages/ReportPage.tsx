import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useCalculatorStore } from '../store/calculatorStore'
import { getState } from '../data/states'
import { getTechnology } from '../data/technologies'
import { formatCr, formatInr, formatUnitsLakh } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Pill } from '../components/ui/Pill'
import { TabBar } from '../components/ui/TabBar'
import { KV } from '../components/ui/KV'
import { LineChartSvg } from '../components/charts/LineChartSvg'
import { DonutSvg } from '../components/charts/DonutSvg'
import { FundingStack } from '../components/ui/FundingStack'
import {
  EPC_BY_STATE,
  FINANCING_PARTNERS,
  INVERTER_BRANDS,
  PANEL_MANUFACTURERS,
  ROBOT_SYSTEMS,
} from '../data/suppliers'
import type { RiskLevel } from '../types'

type TabId = 'overview' | 'costs' | 'model' | 'risks' | 'action' | 'suppliers'

const RISK_ROWS: { risk: string; impact: string; mitigation: string; level: RiskLevel }[] = [
  { risk: 'r1', impact: 'r1i', mitigation: 'r1m', level: 'HIGH' },
  { risk: 'r2', impact: 'r2i', mitigation: 'r2m', level: 'MED' },
  { risk: 'r3', impact: 'r3i', mitigation: 'r3m', level: 'MED' },
  { risk: 'r4', impact: 'r4i', mitigation: 'r4m', level: 'MED' },
  { risk: 'r5', impact: 'r5i', mitigation: 'r5m', level: 'HIGH' },
  { risk: 'r6', impact: 'r6i', mitigation: 'r6m', level: 'MED' },
  { risk: 'r7', impact: 'r7i', mitigation: 'r7m', level: 'LOW' },
  { risk: 'r8', impact: 'r8i', mitigation: 'r8m', level: 'LOW' },
]

function levelStyle(level: RiskLevel) {
  if (level === 'HIGH') return 'bg-sb-red/20 text-sb-red'
  if (level === 'MED') return 'bg-sb-orange/15 text-sb-orange'
  return 'bg-white/10 text-white/55'
}

export function ReportPage() {
  const { t } = useTranslation()
  const { stateId, districtId, technologyId, getFinancials } = useCalculatorStore()
  const [tab, setTab] = useState<TabId>('overview')

  const state = getState(stateId)
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
    const colors = ['#fbbf24', '#22c55e', '#0ea5e9', '#8b5cf6', '#f97316', '#6b7280']
    return fin.costLines.map((c, i) => ({
      value: c.amountRs,
      color: colors[i % colors.length],
    }))
  }, [fin])

  if (!state || !fin) {
    return (
      <Card>
        <p className="text-white/70">
          Adjust your land area in the calculator (must be greater than zero).
        </p>
        <Link className="mt-4 inline-block font-bold text-sb-gold" to="/calculator">
          ← {t('nav.calculator')}
        </Link>
      </Card>
    )
  }

  const line40 = fin.cumulative40.map((d) => ({ x: d.year, y: d.cumulativeRs }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">{t('report.title')}</h1>
          <p className="mt-1 text-sm text-white/55">
            {district?.name}, {state.name} · {tech.label}
          </p>
        </div>
        <Link
          to="/calculator"
          className="shrink-0 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/75 hover:border-white/30"
        >
          ← {t('report.back')}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Pill value={formatUnitsLakh(fin.year1UnitsLakh)} label={t('report.pills.y1')} />
        <Pill value={formatCr(fin.totalCapexRs)} label={t('report.pills.capex')} />
        <Pill value={formatCr(fin.totalCashRequiredRs)} label={t('report.pills.cash')} />
        <Pill value={formatCr(fin.subsidyAmountRs)} label={t('report.pills.subsidy')} />
        <Pill value={formatCr(fin.loanAmountRs)} label={t('report.pills.loan')} />
        <Pill value={formatInr(fin.monthlyEmiRs)} label={t('report.pills.emi')} />
      </div>

      <TabBar tabs={[...tabs]} active={tab} onChange={(id) => setTab(id as TabId)} />

      {tab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.overview.system')}
            </div>
            <div className="mt-3 space-y-1">
              <KV label={t('report.overview.mwAc')} value={`${fin.systemMwAc} MW`} variant="highlight" />
              <KV label={t('report.overview.mwDc')} value={`${fin.systemMwDc} MW`} />
              <KV label={t('report.overview.kwp')} value={formatInr(fin.systemKwp)} />
              <KV label={t('report.overview.panels')} value={formatInr(fin.panelCountApprox)} />
              <KV label={t('report.overview.dcac')} value={fin.dcAcRatio.toFixed(2)} />
            </div>
          </Card>
          <Card accent="blue">
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.overview.climate')}
            </div>
            <div className="mt-3 space-y-1">
              <KV label={t('report.overview.ghi')} value={`${state.ghiKwhM2Day} kWh/m²/day`} />
              <KV label={t('report.overview.peakSun')} value={`${state.peakSunHours} h`} />
              <KV label={t('report.overview.tariff')} value={`₹${fin.tariffMidRs.toFixed(2)}`} />
              <KV label={t('report.overview.subsidyPct')} value={`${state.subsidyPct}%`} />
            </div>
            <p className="mt-3 text-xs text-white/50">{state.monsoonNote}</p>
            <p className="mt-1 text-xs text-white/50">{state.gridQuality}</p>
          </Card>

          <Card className="lg:col-span-2">
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.overview.chart40')}
            </div>
            <div className="mt-4">
              <LineChartSvg data={line40} />
            </div>
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
              label={t('report.overview.mMultiple')}
              value={`${fin.returnMultiple25}×`}
              variant="warn"
            />
          </Card>

          <Card accent="green">
            <div className="text-xs font-extrabold uppercase text-sb-orange">
              {t('report.overview.warnings')}
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-white/70">
              <li>{t('report.overview.wCash', { amount: `₹${formatInr(fin.totalCashRequiredRs)}` })}</li>
              <li>{t('report.overview.wPpa')}</li>
              <li>{t('report.overview.wTx')}</li>
              <li>{t('report.overview.wDust')}</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'costs' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.costs.donut')}
            </div>
            <div className="mt-4">
              <DonutSvg segments={donutSegments} />
            </div>
          </Card>
          <Card>
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.costs.funding')}
            </div>
            <div className="mt-4">
              <FundingStack
                parts={[
                  { label: t('report.costs.govt'), amountRs: fin.subsidyAmountRs, color: '#22c55e' },
                  { label: t('report.costs.loan'), amountRs: fin.loanAmountRs, color: '#0ea5e9' },
                  { label: t('report.costs.you'), amountRs: fin.cashEquityRs, color: '#f97316' },
                ]}
              />
              <div className="mt-4 space-y-1 text-xs text-white/55">
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
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.costs.table')}
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase text-white/40">
                    <th className="py-2 pr-4">Item</th>
                    <th className="py-2 text-right">Amount (₹)</th>
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
            <p className="mt-2 text-xs text-white/45">{t('report.costs.landFree')}</p>
          </Card>

          <Card className="lg:col-span-2" accent="green">
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.costs.reality')}
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-white/70">
              <li>{t('report.costs.subsidyDelay')}</li>
              <li>{t('report.costs.reserve')}</li>
            </ul>
            <div className="mt-4 text-xs font-extrabold uppercase text-white/45">
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
        <div className="space-y-4">
          <Card>
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.model.chart')}
            </div>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={modelChartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v) => {
                      const n = typeof v === 'number' ? v : Number(v)
                      return [`₹${(n * 1e7).toLocaleString('en-IN')}`, 'Cumulative']
                    }}
                  />
                  <Line type="monotone" dataKey="cumulativeCr" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-white/45">{t('report.model.note')}</p>
          </Card>

          <Card>
            <div className="text-xs font-extrabold uppercase text-white/45">
              {t('report.model.table')}
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase text-white/40">
                    <th className="py-2 pr-2">{t('report.model.colYear')}</th>
                    <th className="py-2 pr-2">{t('report.model.colUnits')}</th>
                    <th className="py-2 pr-2">{t('report.model.colGross')}</th>
                    <th className="py-2 pr-2">{t('report.model.colCost')}</th>
                    <th className="py-2 pr-2">{t('report.model.colNet')}</th>
                    <th className="py-2">{t('report.model.colCum')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fin.yearly.map((r) => (
                    <tr
                      key={r.year}
                      className={`border-b border-white/5 ${r.year === 11 ? 'bg-sb-gold/10' : ''}`}
                    >
                      <td className="py-1.5 pr-2 font-mono font-bold">{r.year}</td>
                      <td className="py-1.5 pr-2 font-mono">{r.unitsLakh}</td>
                      <td className="py-1.5 pr-2 font-mono">{formatInr(r.grossRevenueRs)}</td>
                      <td className="py-1.5 pr-2 font-mono">{formatInr(r.omPlusEmiRs)}</td>
                      <td className="py-1.5 pr-2 font-mono text-sb-green">{formatInr(r.netProfitRs)}</td>
                      <td className="py-1.5 font-mono text-white/80">{formatInr(r.cumulativeRs)}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/5 font-extrabold">
                    <td className="py-2 pr-2" colSpan={4}>
                      {t('report.model.footer')}
                    </td>
                    <td className="py-2 font-mono text-sb-gold" colSpan={2}>
                      ₹{formatInr(fin.netProfit25YrsRs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 'risks' && (
        <Card>
          <div className="text-xs font-extrabold uppercase text-white/45">
            {t('report.risks.title')}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="text-[10px] font-extrabold uppercase text-white/35">Risk</div>
            <div className="text-[10px] font-extrabold uppercase text-white/35">Impact</div>
            <div className="text-[10px] font-extrabold uppercase text-white/35">Mitigation</div>
          </div>
          <div className="mt-2 space-y-3">
            {RISK_ROWS.map((row) => (
              <div
                key={row.risk}
                className="grid gap-2 rounded-lg border border-white/10 bg-sb-bg/40 p-3 md:grid-cols-3"
              >
                <div>
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold ${levelStyle(row.level)}`}>
                    {row.level}
                  </span>
                  <div className="mt-2 text-sm font-bold text-white">{t(`report.risks.${row.risk}`)}</div>
                </div>
                <div className="text-sm text-white/65">{t(`report.risks.${row.impact}`)}</div>
                <div className="text-sm text-white/65">{t(`report.risks.${row.mitigation}`)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'action' && <ActionPlanTab state={state} />}

      {tab === 'suppliers' && <SuppliersTab stateId={stateId} />}
    </div>
  )
}

function ActionPlanTab({ state }: { state: NonNullable<ReturnType<typeof getState>> }) {
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
    <div className="space-y-4">
      <Card>
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.action.title')}</div>
        <div className="mt-4 space-y-3">
          {phases.map((ph) => (
            <div key={ph.title} className={`rounded-xl border p-4 ${ph.tone}`}>
              <div className="text-xs font-extrabold uppercase text-sb-gold">
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
        <div className="text-xs font-extrabold uppercase text-white/45">
          {t('report.action.contacts')}
        </div>
        <div className="mt-3 space-y-2 text-sm text-white/75">
          <div>
            <span className="font-bold text-white">{t('report.action.nodalLabel')}:</span> {state.nodalAgency}{' '}
            (verify current helpline on official portal)
          </div>
          <div>
            <span className="font-bold text-white">{t('report.action.discomLabel')}:</span> {state.discom}
          </div>
          <div>
            <span className="font-bold text-white">Bank:</span> {t('report.action.bank')}
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-xs font-extrabold uppercase text-white/45">
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
    stateId === 'gj' ? 'cropsGj' : stateId === 'rj' ? 'cropsRj' : 'cropsDef'
  return (
    <Card accent="green">
      <div className="text-xs font-extrabold uppercase text-sb-greenMuted">
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
  const epcs = EPC_BY_STATE[stateId] ?? EPC_BY_STATE.gj

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.suppliers.epc')}</div>
        <ul className="mt-3 space-y-2">
          {epcs.map((e) => (
            <li
              key={e.name}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-sb-bg/50 px-3 py-2"
            >
              <span className="font-bold text-white">{e.name}</span>
              <span className="rounded bg-sb-green/20 px-2 py-0.5 text-[10px] font-extrabold text-sb-green">
                {t('report.suppliers.verified')}
              </span>
              <a className="text-xs text-sb-blue hover:underline" href={e.url} target="_blank" rel="noreferrer">
                {e.url.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.suppliers.panels')}</div>
        <p className="mt-1 text-xs text-white/45">{t('report.suppliers.almm')}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {PANEL_MANUFACTURERS.map((p) => (
            <li key={p.name} className="flex flex-wrap justify-between gap-2 border-b border-white/5 py-2">
              <span className="font-bold text-white">{p.name}</span>
              <span className="text-white/55">
                {t(p.locationKey)} · {t(p.techKey)}
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60">
                {p.tag}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.suppliers.inverters')}</div>
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
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.suppliers.robots')}</div>
        <ul className="mt-3 space-y-2">
          {ROBOT_SYSTEMS.map((r) => (
            <li key={r.name} className="rounded-lg border border-white/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white">{r.name}</span>
                {r.rec && (
                  <span className="rounded bg-sb-purple/20 px-2 py-0.5 text-[10px] font-extrabold text-sb-purple">
                    {t('report.suppliers.recommended')}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-white/55">
                {t(r.capitalKey)} · {t(r.runKey)}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card accent="green">
        <div className="text-xs font-extrabold uppercase text-white/45">{t('report.suppliers.finance')}</div>
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
