import type { SolarMonthly, SolarResource } from '@/types'
import { monthlyShapeFromGhi } from '@/lib/region'

const PVWATTS_URL = 'https://developer.nrel.gov/api/pvwatts/v8.json'

/** NSRDB-backed monthly irradiance via PVWatts v8 (plan §6.1). Requires `NREL_API_KEY`. */
export async function fetchNrelPvwattsSolar(opts: {
  lat: number
  lon: number
  apiKey: string
  signal?: AbortSignal
}): Promise<SolarResource | null> {
  const { lat, lon, apiKey } = opts
  const tilt = Math.min(Math.max(lat, 0), 60)
  const params = new URLSearchParams({
    api_key: apiKey,
    system_capacity: '100',
    module_type: '0',
    losses: '14',
    array_type: '0',
    tilt: String(tilt),
    azimuth: '180',
    lat: String(lat),
    lon: String(lon),
    dataset: 'nsrdb',
    radius: '0',
    timeframe: 'monthly',
    dc_ac_ratio: '1.2',
    inv_eff: '96',
  })

  const res = await fetch(`${PVWATTS_URL}?${params}`, {
    signal: opts.signal,
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null

  const data = (await res.json()) as {
    errors?: string[]
    outputs?: {
      solrad_monthly?: number[]
      solrad_annual?: number
    }
  }

  if (data.errors?.length) return null

  const monthlyArr = data.outputs?.solrad_monthly
  const ann = data.outputs?.solrad_annual
  if (!monthlyArr || monthlyArr.length !== 12 || typeof ann !== 'number' || !Number.isFinite(ann)) {
    return null
  }

  const monthly: SolarMonthly = {
    jan: monthlyArr[0],
    feb: monthlyArr[1],
    mar: monthlyArr[2],
    apr: monthlyArr[3],
    may: monthlyArr[4],
    jun: monthlyArr[5],
    jul: monthlyArr[6],
    aug: monthlyArr[7],
    sep: monthlyArr[8],
    oct: monthlyArr[9],
    nov: monthlyArr[10],
    dec: monthlyArr[11],
    ann,
  }

  const shape = monthlyShapeFromGhi(monthly)

  return {
    source: 'nrel_nsrdb',
    ghiKwhM2Day: ann,
    peakSunHours: ann,
    monthlyGenShape: shape,
    monthlyGhi: monthly,
  }
}
