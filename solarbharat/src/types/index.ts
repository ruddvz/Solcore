import geography from '@/data/india-geography.json'

export type LandUnit = 'acre' | 'bigha' | 'guntha' | 'hectare'

export type TechId = 'topcon_bifacial' | 'perc_bifacial' | 'perc_mono'

export type RiskLevel = 'HIGH' | 'MED' | 'LOW'

export interface DistrictInfo {
  id: string
  name: string
}

/** Static geography row from india-geography.json */
export interface GeographyDistrict {
  id: string
  name: string
  lat: number
  lon: number
}

export interface GeographyState {
  id: string
  name: string
  districts: GeographyDistrict[]
}

export interface GeographyFile {
  meta: Record<string, unknown>
  states: GeographyState[]
}

export const INDIA_GEOGRAPHY = geography as GeographyFile

export interface SolarMonthly {
  jan: number
  feb: number
  mar: number
  apr: number
  may: number
  jun: number
  jul: number
  aug: number
  sep: number
  oct: number
  nov: number
  dec: number
  ann: number
}

/** Solar resource bundle for finance + charts */
export interface SolarResource {
  /** Data lineage for UI labels */
  source: 'nrel_nsrdb' | 'nasa_power' | 'fallback'
  ghiKwhM2Day: number
  peakSunHours: number
  monthlyGenShape: number[]
  monthlyGhi: SolarMonthly
}

export interface StateInfo {
  id: string
  name: string
  nodalAgency: string
  discom: string
  ghiKwhM2Day: number
  peakSunHours: number
  tariffMinRs: number
  tariffMaxRs: number
  subsidyPct: number
  loanRatePct: number
  monthlyGenShape: number[]
  climateNote: string
  monsoonNote: string
  gridQuality: string
  districts: DistrictInfo[]
  /** True when tariff/subsidy uses generic placeholders */
  policyIsFallback?: boolean
  solar?: SolarResource
  /** Phase 2 §6.2 — manual shading loss 0–30% applied to irradiance */
  shadingLossPct?: number
  /** Performance ratio after shading (for display; finance uses this) */
  effectivePerformanceRatio?: number
  /** Optional pin-drop coordinates (Leaflet) overriding district centroid for solar fetch */
  pinLat?: number
  pinLon?: number
}

export interface TechnologySpec {
  id: TechId
  label: string
  efficiencyPct: number
  degradationPctPerYear: number
  costPerWpRs: number
  bifacialGainPct: number
  verdict: 'best' | 'good' | 'acceptable'
}

export interface CostLineItem {
  key: string
  labelKey: string
  amountRs: number
  category: 'hardware' | 'soft' | 'other'
}

export interface YearlyRow {
  year: number
  unitsLakh: number
  grossRevenueRs: number
  omPlusEmiRs: number
  netProfitRs: number
  cumulativeRs: number
}

export interface FinancialResult {
  systemMwAc: number
  systemMwDc: number
  systemKwp: number
  panelCountApprox: number
  dcAcRatio: number
  year1UnitsLakh: number
  totalCapexRs: number
  costLines: CostLineItem[]
  subsidyAmountRs: number
  loanAmountRs: number
  cashEquityRs: number
  operatingReserveRs: number
  totalCashRequiredRs: number
  monthlyEmiRs: number
  yearly: YearlyRow[]
  cumulative40: { year: number; cumulativeRs: number }[]
  breakevenYear: number | null
  cashRecoveryYear: number | null
  postLoanMonthlyIncomeRs: number
  netProfit25YrsRs: number
  netProfit40YrsRs: number
  returnMultiple25: number
  tariffMidRs: number
  performanceRatio: number
}
