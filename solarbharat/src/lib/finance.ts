import type { FinancialResult, LandUnit, StateInfo, TechnologySpec } from '@/types'
import { getTechnology } from '@/data/technologies'

type CostLineItem = FinancialResult['costLines'][number]

/** Convert land input to acres (approximate pan-India friendly factors). */
export function landToAcres(value: number, unit: LandUnit): number {
  switch (unit) {
    case 'acre':
      return value
    case 'hectare':
      return value * 2.47105
    case 'guntha':
      return value / 40
    case 'bigha':
      return value * 0.4
    default:
      return value
  }
}

/** Ground-mount rule from product plan: 0.2 MW AC per acre. */
export function acresToMwAc(acres: number): number {
  return acres * 0.2
}

function pmt(ratePerPeriod: number, nper: number, pv: number): number {
  if (ratePerPeriod === 0) return pv / nper
  const x = (1 + ratePerPeriod) ** nper
  return (pv * ratePerPeriod * x) / (x - 1)
}

function degradationFactor(tech: TechnologySpec, yearIndex1Based: number): number {
  const r = tech.degradationPctPerYear / 100
  return (1 - r) ** (yearIndex1Based - 1)
}

/** Build capex and split into display categories (order matches plan). */
function buildCostLines(totalCapexRs: number): FinancialResult['costLines'] {
  const splits: { key: string; labelKey: string; pct: number; category: CostLineItem['category'] }[] = [
    { key: 'panels', labelKey: 'costLine.panels', pct: 0.32, category: 'hardware' },
    { key: 'inverters', labelKey: 'costLine.inverters', pct: 0.1, category: 'hardware' },
    { key: 'mounting', labelKey: 'costLine.mounting', pct: 0.14, category: 'hardware' },
    { key: 'transformer', labelKey: 'costLine.transformer', pct: 0.08, category: 'hardware' },
    { key: 'civil', labelKey: 'costLine.civil', pct: 0.07, category: 'hardware' },
    { key: 'grid', labelKey: 'costLine.grid', pct: 0.06, category: 'hardware' },
    { key: 'cables', labelKey: 'costLine.cables', pct: 0.04, category: 'hardware' },
    { key: 'scada', labelKey: 'costLine.scada', pct: 0.02, category: 'hardware' },
    { key: 'robot', labelKey: 'costLine.robot', pct: 0.03, category: 'hardware' },
    { key: 'epc', labelKey: 'costLine.epc', pct: 0.08, category: 'soft' },
    { key: 'approvals', labelKey: 'costLine.approvals', pct: 0.03, category: 'soft' },
    { key: 'contingency', labelKey: 'costLine.contingency', pct: 0.03, category: 'other' },
  ]
  return splits.map((s) => ({
    key: s.key,
    labelKey: s.labelKey,
    amountRs: Math.round(totalCapexRs * s.pct),
    category: s.category,
  }))
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
  const systemKwp = systemMwAc * 1000

  const dcAcRatio = 1.25
  const systemMwDc = systemMwAc * dcAcRatio
  const panelWp = 600
  const panelCountApprox = Math.round((systemMwDc * 1_000_000) / panelWp)

  const performanceRatio = 0.78
  const bifacialMult = 1 + tech.bifacialGainPct / 100

  /** NASA POWER ANN is average daily GHI (kWh/m²/day) ≈ peak sun hours for modelling */
  const peakSun = input.state.peakSunHours

  const specificYieldKwhPerKwp = peakSun * 365 * performanceRatio * bifacialMult

  const year1Kwh = systemKwp * specificYieldKwhPerKwp
  const year1UnitsLakh = year1Kwh / 100_000

  const tariffMidRs = (input.state.tariffMinRs + input.state.tariffMaxRs) / 2

  const capexPerWpRs = tech.costPerWpRs * 1.85 + 20
  const totalCapexRs = Math.round(systemKwp * capexPerWpRs)

  const costLines = buildCostLines(totalCapexRs)

  const subsidyAmountRs = Math.round(totalCapexRs * (input.state.subsidyPct / 100))
  const loanFraction = 0.3
  const loanAmountRs = Math.round(totalCapexRs * loanFraction)
  const developerShare = Math.max(0, 1 - input.state.subsidyPct / 100 - loanFraction)
  const cashEquityRs = Math.round(totalCapexRs * developerShare)
  const operatingReserveRs = Math.round(totalCapexRs * 0.06)
  const totalCashRequiredRs = cashEquityRs + operatingReserveRs

  const annualRate = input.state.loanRatePct / 100
  const monthlyRate = annualRate / 12
  const loanTenureMonths = 120
  const monthlyEmiRs = Math.round(pmt(monthlyRate, loanTenureMonths, loanAmountRs))

  const omPerKwpY1 = 4500
  const yearly: FinancialResult['yearly'] = []
  let cumulative = -totalCashRequiredRs
  let breakevenYear: number | null = null
  let cashRecoveryYear: number | null = null

  for (let y = 1; y <= 25; y++) {
    const deg = degradationFactor(tech, y)
    const unitsKwh = year1Kwh * deg
    const unitsLakh = unitsKwh / 100_000
    const grossRevenueRs = Math.round(unitsKwh * tariffMidRs)
    const omRate = y >= 6 ? 1.15 : 1
    const omRs = Math.round(systemKwp * omPerKwpY1 * omRate)
    const emiRs = y <= 10 ? monthlyEmiRs * 12 : 0
    const omPlusEmiRs = omRs + emiRs
    const netProfitRs = grossRevenueRs - omPlusEmiRs
    cumulative += netProfitRs
    yearly.push({
      year: y,
      unitsLakh: Math.round(unitsLakh * 100) / 100,
      grossRevenueRs,
      omPlusEmiRs,
      netProfitRs,
      cumulativeRs: cumulative,
    })
    if (breakevenYear === null && cumulative >= 0) breakevenYear = y
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
    const omRate = y >= 6 ? 1.15 : 1
    const omRs = Math.round(systemKwp * omPerKwpY1 * omRate)
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
    const omRate = y >= 6 ? 1.15 : 1
    const omRs = Math.round(systemKwp * omPerKwpY1 * omRate)
    const emiRs = y <= 10 ? monthlyEmiRs * 12 : 0
    net40 += grossRevenueRs - omRs - emiRs
  }
  const netProfit40YrsRs = net40

  const returnMultiple25 =
    totalCashRequiredRs > 0 ? netProfit25YrsRs / totalCashRequiredRs : 0

  return {
    systemMwAc: Math.round(systemMwAc * 1000) / 1000,
    systemMwDc: Math.round(systemMwDc * 1000) / 1000,
    systemKwp: Math.round(systemKwp),
    panelCountApprox,
    dcAcRatio,
    year1UnitsLakh: Math.round(year1UnitsLakh * 100) / 100,
    totalCapexRs,
    costLines,
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
    returnMultiple25: Math.round(returnMultiple25 * 100) / 100,
    tariffMidRs,
    performanceRatio,
  }
}
