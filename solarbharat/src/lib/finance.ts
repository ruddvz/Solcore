import type { CostLineItem, FinancialResult, LandUnit, StateInfo, TechnologySpec } from '@/types'
import { getTechnology } from '@/data/technologies'

/** Plan0 §3 — conservative performance ratio (not marketing 0.85) */
const PR = 0.78

/** Plan0 §3 — area × factor = acres (standard Indian bigha note in UI) */
const UNIT_TO_ACRES: Record<LandUnit, number> = {
  acre: 1,
  bigha: 0.6198,
  guntha: 0.025,
  hectare: 2.4711,
}

export function landToAcres(value: number, unit: LandUnit): number {
  return value * UNIT_TO_ACRES[unit]
}

/** Plan0 §3 — ground-mount: 0.2 MW AC per acre */
export function acresToMwAc(acres: number): number {
  return acres * 0.2
}

function pmt(ratePerPeriod: number, nper: number, pv: number): number {
  if (ratePerPeriod === 0) return pv / nper
  const x = (1 + ratePerPeriod) ** nper
  return (pv * ratePerPeriod * x) / (x - 1)
}

function degradationFactor(tech: TechnologySpec, year: number): number {
  const r = tech.degradationPctPerYear / 100
  return (1 - r) ** (year - 1)
}

/** Plan0 §3 — explicit capex stack; EPC + contingency on hardware subtotal */
function buildPlanCostLines(capacityKWp: number, tech: TechnologySpec): {
  lines: CostLineItem[]
  totalCapexRs: number
} {
  const w = capacityKWp
  const panels = w * tech.costPerWpRs * 1000
  const inverters = w * 8000
  const mounting = w * 6500
  const transformer = w > 500 ? 1_500_000 : w * 2500
  const civil = w * 3500
  const gridConnect = Math.max(w * 1500, 300_000)
  const cables = w * 2000
  const scada = w * 1200
  const robot = w >= 1000 ? 900_000 : 0
  const approvals = Math.max(w * 500, 100_000)
  const subtotal =
    panels +
    inverters +
    mounting +
    transformer +
    civil +
    gridConnect +
    cables +
    scada +
    robot +
    approvals
  const epc = subtotal * 0.08
  const contingency = subtotal * 0.03

  const lines: CostLineItem[] = [
    { key: 'panels', labelKey: 'costLine.panels', amountRs: Math.round(panels), category: 'hardware' },
    { key: 'inverters', labelKey: 'costLine.inverters', amountRs: Math.round(inverters), category: 'hardware' },
    { key: 'mounting', labelKey: 'costLine.mounting', amountRs: Math.round(mounting), category: 'hardware' },
    {
      key: 'transformer',
      labelKey: 'costLine.transformer',
      amountRs: Math.round(transformer),
      category: 'hardware',
    },
    { key: 'civil', labelKey: 'costLine.civil', amountRs: Math.round(civil), category: 'hardware' },
    { key: 'grid', labelKey: 'costLine.grid', amountRs: Math.round(gridConnect), category: 'hardware' },
    { key: 'cables', labelKey: 'costLine.cables', amountRs: Math.round(cables), category: 'hardware' },
    { key: 'scada', labelKey: 'costLine.scada', amountRs: Math.round(scada), category: 'hardware' },
    { key: 'robot', labelKey: 'costLine.robot', amountRs: Math.round(robot), category: 'hardware' },
    { key: 'approvals', labelKey: 'costLine.approvals', amountRs: Math.round(approvals), category: 'soft' },
    { key: 'epc', labelKey: 'costLine.epc', amountRs: Math.round(epc), category: 'soft' },
    { key: 'contingency', labelKey: 'costLine.contingency', amountRs: Math.round(contingency), category: 'other' },
  ]
  const totalCapexRs = lines.reduce((s, l) => s + l.amountRs, 0)
  return { lines, totalCapexRs }
}

/** Plan0 Tab 2 donut — 8 labelled segments */
function buildDonutSegments(lines: CostLineItem[]): FinancialResult['donutSegments'] {
  const by = (k: string) => lines.find((l) => l.key === k)?.amountRs ?? 0
  const others =
    by('transformer') +
    by('scada') +
    by('robot') +
    by('approvals') +
    by('contingency')
  return [
    { key: 'donutPanels', labelKey: 'report.costs.donutPanels', amountRs: by('panels'), color: '#fbbf24' },
    { key: 'donutInverters', labelKey: 'report.costs.donutInverters', amountRs: by('inverters'), color: '#22c55e' },
    { key: 'donutMounting', labelKey: 'report.costs.donutMounting', amountRs: by('mounting'), color: '#0ea5e9' },
    { key: 'donutCivil', labelKey: 'report.costs.donutCivil', amountRs: by('civil'), color: '#8b5cf6' },
    { key: 'donutGrid', labelKey: 'report.costs.donutGrid', amountRs: by('grid'), color: '#f97316' },
    { key: 'donutCables', labelKey: 'report.costs.donutCables', amountRs: by('cables'), color: '#6b7280' },
    { key: 'donutEpc', labelKey: 'report.costs.donutEpc', amountRs: by('epc'), color: '#f59e0b' },
    { key: 'donutOthers', labelKey: 'report.costs.donutOthers', amountRs: others, color: '#16a34a' },
  ]
}

export function calculateFinancials(input: {
  state: StateInfo
  landValue: number
  landUnit: LandUnit
  technologyId: string
}): FinancialResult {
  const tech = getTechnology(input.technologyId)
  const acres = landToAcres(input.landValue, input.landUnit)
  const systemMwAc = acresToMwAc(acres)
  const systemKwp = Math.round(systemMwAc * 1000)

  const panelWp = 560
  const panelCountApprox = Math.round((systemKwp * 1000) / panelWp)
  const systemKwDc = (panelCountApprox * panelWp) / 1000
  const systemMwDc = systemKwDc / 1000
  const dcAcRatio = systemKwp > 0 ? systemKwDc / systemKwp : 0

  const inverterCountApprox = Math.ceil(systemKwp / 100)

  const pr =
    input.state.effectivePerformanceRatio !== undefined
      ? input.state.effectivePerformanceRatio
      : PR
  const bifacialMult = 1 + tech.bifacialGainPct / 100

  const ghi = input.state.ghiKwhM2Day
  const year1Kwh = systemKwp * ghi * 365 * pr * bifacialMult
  const year1UnitsLakh = year1Kwh / 100_000

  const tariffMidRs = (input.state.tariffMinRs + input.state.tariffMaxRs) / 2

  const { lines: costLines, totalCapexRs } = buildPlanCostLines(systemKwp, tech)
  const donutSegments = buildDonutSegments(costLines)

  const subsidyAmountRs = Math.round(totalCapexRs * (input.state.subsidyPct / 100))
  const afterSubsidyRs = Math.max(0, totalCapexRs - subsidyAmountRs)
  const loanAmountRs = Math.round(afterSubsidyRs * 0.3)
  const cashEquityRs = Math.max(0, totalCapexRs - subsidyAmountRs - loanAmountRs)
  const operatingReserveRs = Math.round(totalCapexRs * 0.06)
  const totalCashRequiredRs = cashEquityRs + operatingReserveRs

  const annualRate = input.state.loanRatePct / 100
  const monthlyRate = annualRate / 12
  const loanTenureMonths = 120
  const monthlyEmiRs = Math.round(pmt(monthlyRate, loanTenureMonths, loanAmountRs))

  const omPerKwpY1 = 4500
  const yearly: FinancialResult['yearly'] = []
  let cumulative = -totalCashRequiredRs
  /** Plan0 §3 — breakeven vs yourCash (equity only); separate from full upfront recovery */
  let profitSumRs = 0
  let breakevenYear: number | null = null
  let cashRecoveryYear: number | null = null

  for (let y = 1; y <= 25; y++) {
    const deg = degradationFactor(tech, y)
    const unitsKwh = year1Kwh * deg
    const unitsLakh = unitsKwh / 100_000
    const grossRevenueRs = Math.round(unitsKwh * tariffMidRs)
    const omMultiplier = 1.15 ** Math.floor((y - 1) / 5)
    const omRs = Math.round(systemKwp * omPerKwpY1 * omMultiplier)
    const emiRs = y <= 10 ? monthlyEmiRs * 12 : 0
    const omPlusEmiRs = omRs + emiRs
    const netProfitRs = grossRevenueRs - omPlusEmiRs
    profitSumRs += netProfitRs
    cumulative += netProfitRs
    yearly.push({
      year: y,
      unitsLakh: Math.round(unitsLakh * 100) / 100,
      grossRevenueRs,
      omRs,
      emiRs,
      omPlusEmiRs,
      netProfitRs,
      cumulativeRs: cumulative,
    })
    if (breakevenYear === null && profitSumRs >= cashEquityRs) breakevenYear = y
    if (cashRecoveryYear === null && cumulative >= 0) cashRecoveryYear = y
  }

  const netProfit25YrsRs = yearly.reduce((s, r) => s + r.netProfitRs, 0)
  const postLoanMonthlyIncomeRs =
    yearly.length >= 11 ? Math.round(yearly[10].netProfitRs / 12) : 0

  let cum40 = -totalCashRequiredRs
  const cumulative40: { year: number; cumulativeRs: number }[] = []
  for (let y = 1; y <= 40; y++) {
    const deg = degradationFactor(tech, y)
    const unitsKwh = year1Kwh * deg
    const grossRevenueRs = Math.round(unitsKwh * tariffMidRs)
    const omMultiplier = 1.15 ** Math.floor((y - 1) / 5)
    const omRs = Math.round(systemKwp * omPerKwpY1 * omMultiplier)
    const emiRs = y <= 10 ? monthlyEmiRs * 12 : 0
    const net = grossRevenueRs - omRs - emiRs
    cum40 += net
    cumulative40.push({ year: y, cumulativeRs: cum40 })
  }

  let net40 = -totalCashRequiredRs
  for (let y = 1; y <= 40; y++) {
    const deg = degradationFactor(tech, y)
    const unitsKwh = year1Kwh * deg
    const grossRevenueRs = Math.round(unitsKwh * tariffMidRs)
    const omMultiplier = 1.15 ** Math.floor((y - 1) / 5)
    const omRs = Math.round(systemKwp * omPerKwpY1 * omMultiplier)
    const emiRs = y <= 10 ? monthlyEmiRs * 12 : 0
    net40 += grossRevenueRs - omRs - emiRs
  }
  const netProfit40YrsRs = net40

  const returnMultiple25 =
    cashEquityRs > 0 ? Math.round((netProfit25YrsRs / cashEquityRs) * 100) / 100 : 0

  return {
    systemMwAc: Math.round(systemMwAc * 1000) / 1000,
    systemMwDc: Math.round(systemMwDc * 1000) / 1000,
    systemKwp,
    panelCountApprox,
    inverterCountApprox,
    dcAcRatio: Math.round(dcAcRatio * 100) / 100,
    year1UnitsLakh: Math.round(year1UnitsLakh * 100) / 100,
    totalCapexRs,
    costLines,
    donutSegments,
    subsidyAmountRs,
    loanAmountRs,
    cashEquityRs,
    operatingReserveRs,
    totalCashRequiredRs,
    monthlyEmiRs,
    yearly,
    cumulative40,
    breakevenYear,
    cashRecoveryYear,
    postLoanMonthlyIncomeRs,
    netProfit25YrsRs,
    netProfit40YrsRs,
    returnMultiple25,
    tariffMidRs,
    performanceRatio: pr,
  }
}
