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
  /** Indicative PPA / tariff-lock horizon (years) for disclosure copy — verify locally */
  ppaLockYearsTypical?: number
  /** Plan0 Tab 5 — nodal agency public portal (verify before sharing) */
  nodalPortalUrl?: string
  /** Short hint when a live helpline is not hardcoded */
  nodalPhoneHint?: string
}

export interface TechnologySpec {
  id: TechId
  label: string
  efficiencyPct: number
  degradationPctPerYear: number
  costPerWpRs: number
  bifacialGainPct: number
  verdict: 'best' | 'good' | 'acceptable'
  /** Plan0 §3 module warranty (years) */
  warrantyYears: number
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
  omRs: number
  emiRs: number
  omPlusEmiRs: number
  netProfitRs: number
  cumulativeRs: number
}

/** Plan0 Tab 2 — donut segment (table uses full `costLines`) */
export interface DonutSegment {
  key: string
  labelKey: string
  amountRs: number
  color: string
}

export interface FinancialResult {
  systemMwAc: number
  systemMwDc: number
  systemKwp: number
  panelCountApprox: number
  inverterCountApprox: number
  dcAcRatio: number
  year1UnitsLakh: number
  totalCapexRs: number
  costLines: CostLineItem[]
  donutSegments: DonutSegment[]
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
