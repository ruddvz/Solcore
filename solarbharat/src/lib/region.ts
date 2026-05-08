import type { GeographyDistrict, GeographyState, SolarMonthly, SolarResource, StateInfo } from '@/types'
import { INDIA_GEOGRAPHY } from '@/types'
import { getStatePolicy, type StatePolicy } from '@/data/statePolicies.generated'
import { getTypicalPpaLockYears } from '@/data/ppaLockTypical'
import { NODAL_PORTALS } from '@/data/nodalPortals'
import { effectivePerformanceRatio } from '@/lib/shading'

const MONTH_KEYS: (keyof SolarMonthly)[] = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

export function getGeographyState(stateId: string): GeographyState | undefined {
  return INDIA_GEOGRAPHY.states.find((s) => s.id === stateId)
}

export function getGeographyDistrict(
  stateId: string,
  districtId: string,
): GeographyDistrict | undefined {
  return getGeographyState(stateId)?.districts.find((d) => d.id === districtId)
}

/** Plan0 §14 — normalize tokens for resilient district matching (IDs, slugs, names). */
export function normalizeLocationToken(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-')
}

/**
 * Resolve a district id from an exact id, slug-like id, or display name.
 */
export function resolveDistrictId(
  stateId: string,
  districtKey: string | null | undefined,
): string | undefined {
  if (!districtKey) return undefined
  const geo = getGeographyState(stateId)
  if (!geo) return undefined
  const compact = districtKey.trim()
  if (geo.districts.some((d) => d.id === compact)) return compact
  const n = normalizeLocationToken(compact)
  const byId = geo.districts.find((d) => normalizeLocationToken(d.id) === n)
  if (byId) return byId.id
  const byName = geo.districts.find((d) => normalizeLocationToken(d.name) === n)
  return byName?.id
}

export function listGeographyStates(): GeographyState[] {
  return INDIA_GEOGRAPHY.states
}

/** Centroid for solar APIs: district pin if known, else state centroid from districts. */
export function coordsForLocation(
  stateId: string,
  districtId: string | null,
): { lat: number; lon: number } | null {
  if (districtId) {
    const d = getGeographyDistrict(stateId, districtId)
    if (d) return { lat: d.lat, lon: d.lon }
  }
  const st = getGeographyState(stateId)
  if (!st?.districts.length) return null
  let lat = 0
  let lon = 0
  for (const x of st.districts) {
    lat += x.lat
    lon += x.lon
  }
  const n = st.districts.length
  return { lat: lat / n, lon: lon / n }
}

/** Derive relative monthly generation shape from NASA monthly GHI (12 values). */
export function monthlyShapeFromGhi(monthly: SolarMonthly): number[] {
  const vals = MONTH_KEYS.map((k) => monthly[k])
  const mean = vals.reduce((a, b) => a + b, 0) / 12
  const base = mean > 0 ? mean : 1
  return vals.map((v) => Math.max(0.15, v / base))
}

/** Fallback when NASA POWER is unavailable — latitude-band heuristic (not site-specific). */
export function fallbackSolar(lat: number): SolarResource {
  const sun =
    lat < 12
      ? [0.92, 1.02, 1.08, 1.06, 1.02, 0.72, 0.62, 0.6, 0.88, 1.02, 1.0, 0.94]
      : lat < 22
        ? [0.93, 1.03, 1.08, 1.08, 1.02, 0.68, 0.58, 0.56, 0.88, 1.06, 1.02, 0.94]
        : [0.9, 1.02, 1.08, 1.1, 1.05, 0.62, 0.52, 0.52, 0.85, 1.05, 1.0, 0.92]
  const avgShape = sun.reduce((a, b) => a + b, 0) / 12
  const peakSunHours = 5.2
  const scale = peakSunHours / avgShape
  return {
    source: 'fallback',
    ghiKwhM2Day: peakSunHours,
    peakSunHours,
    monthlyGenShape: sun.map((s) => s / avgShape),
    monthlyGhi: {
      jan: scale * sun[0],
      feb: scale * sun[1],
      mar: scale * sun[2],
      apr: scale * sun[3],
      may: scale * sun[4],
      jun: scale * sun[5],
      jul: scale * sun[6],
      aug: scale * sun[7],
      sep: scale * sun[8],
      oct: scale * sun[9],
      nov: scale * sun[10],
      dec: scale * sun[11],
      ann: peakSunHours,
    },
  }
}

export function buildStateInfo(
  geo: GeographyState,
  policy: StatePolicy,
  solar: SolarResource,
  opts?: { shadingLossPct?: number; pinLat?: number; pinLon?: number },
): StateInfo {
  const districts = geo.districts.map((d) => ({ id: d.id, name: d.name }))
  const shading = opts?.shadingLossPct ?? 0
  const nodal = NODAL_PORTALS[geo.id]
  return {
    id: geo.id,
    name: geo.name,
    nodalAgency: policy.nodalAgency,
    discom: policy.discomNote,
    ghiKwhM2Day: solar.ghiKwhM2Day,
    peakSunHours: solar.peakSunHours,
    tariffMinRs: policy.tariffBandRs[0],
    tariffMaxRs: policy.tariffBandRs[1],
    subsidyPct: policy.subsidyPctMid,
    loanRatePct: policy.loanRatePct,
    monthlyGenShape: solar.monthlyGenShape,
    climateNote: policy.climateNote,
    monsoonNote: policy.monsoonNote,
    gridQuality: policy.gridQuality,
    districts,
    policyIsFallback: policy.isFallbackPolicy === true,
    solar,
    shadingLossPct: shading > 0 ? shading : undefined,
    effectivePerformanceRatio: effectivePerformanceRatio(0.78, shading),
    pinLat: opts?.pinLat,
    pinLon: opts?.pinLon,
    ppaLockYearsTypical: getTypicalPpaLockYears(geo.id),
    nodalPortalUrl: nodal?.url,
    nodalPhoneHint: nodal?.phoneHint,
  }
}

export function resolveStateForCalculator(
  stateId: string,
  districtId: string,
  solar?: SolarResource | null,
  opts?: { shadingLossPct?: number; pinLat?: number; pinLon?: number },
): StateInfo | null {
  const geo = getGeographyState(stateId)
  const policy = getStatePolicy(stateId)
  if (!geo || !policy) return null
  const d = getGeographyDistrict(stateId, districtId)
  const lat = d?.lat ?? geo.districts[0]?.lat ?? 22
  const resolvedSolar = solar ?? fallbackSolar(lat)
  return buildStateInfo(geo, policy, resolvedSolar, opts)
}
