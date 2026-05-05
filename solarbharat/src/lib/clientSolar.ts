import type { SolarResource } from '@/types'
import { coordsForLocation, fallbackSolar } from '@/lib/region'
import { fetchNasaPowerClimatology } from '@/lib/nasaPowerSolar'

/**
 * Resolve coordinates: explicit pin wins, else district/state centroid.
 */
export function resolveSolarCoords(
  stateId: string,
  districtId: string,
  pin?: { lat: number; lon: number } | null,
): { lat: number; lon: number } | null {
  if (pin && Number.isFinite(pin.lat) && Number.isFinite(pin.lon)) {
    return { lat: pin.lat, lon: pin.lon }
  }
  return coordsForLocation(stateId, districtId)
}

/**
 * GitHub Pages / static export has no `/api/solar`. Fetch NASA POWER directly from the browser,
 * then fall back to the latitude heuristic (same as API route).
 */
export async function fetchSolarForStaticSite(
  stateId: string,
  districtId: string,
  pin?: { lat: number; lon: number } | null,
): Promise<SolarResource> {
  const c = resolveSolarCoords(stateId, districtId, pin)
  if (!c) {
    return fallbackSolar(22)
  }
  const nasa = await fetchNasaPowerClimatology(c.lat, c.lon)
  if (nasa) return nasa
  return fallbackSolar(c.lat)
}

/** Browser-side solar fetch: tries `/api/solar` first, then NASA POWER + fallback. */
export async function fetchSolarClient(
  stateId: string,
  districtId: string,
  pin?: { lat: number; lon: number } | null,
): Promise<SolarResource> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const qs = new URLSearchParams({ stateId })
  if (districtId) qs.set('districtId', districtId)
  if (pin) {
    qs.set('lat', String(pin.lat))
    qs.set('lon', String(pin.lon))
  }
  try {
    const res = await fetch(`${base}/api/solar?${qs.toString()}`)
    if (res.ok) {
      return (await res.json()) as SolarResource
    }
  } catch {
    /* static host */
  }
  return fetchSolarForStaticSite(stateId, districtId, pin)
}
