import type { SolarResource } from '@/types'
import { coordsForLocation, fallbackSolar } from '@/lib/region'
import { fetchNasaPowerClimatology } from '@/lib/nasaPowerSolar'

/**
 * GitHub Pages / static export has no `/api/solar`. Fetch NASA POWER directly from the browser,
 * then fall back to the latitude heuristic (same as API route).
 */
export async function fetchSolarForStaticSite(
  stateId: string,
  districtId: string,
): Promise<SolarResource> {
  const c = coordsForLocation(stateId, districtId)
  if (!c) {
    return fallbackSolar(22)
  }
  const nasa = await fetchNasaPowerClimatology(c.lat, c.lon)
  if (nasa) return nasa
  return fallbackSolar(c.lat)
}
