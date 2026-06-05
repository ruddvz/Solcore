import { NextResponse } from 'next/server'
import { guardSolarGet } from '@/lib/apiGuards'
import { coordsForLocation, fallbackSolar } from '@/lib/region'
import { fetchNasaPowerClimatology } from '@/lib/nasaPowerSolar'
import { fetchNrelPvwattsSolar } from '@/lib/nrelSolar'

const CACHE_CONTROL = 'public, s-maxage=86400, max-age=86400'
const UPSTREAM_TIMEOUT_MS = 15_000

function upstreamSignal(): AbortSignal {
  if (typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
  }
  const c = new AbortController()
  setTimeout(() => c.abort(), UPSTREAM_TIMEOUT_MS)
  return c.signal
}

/** Rough India bounding box for pin validation (plan §6.1 — lat/lon query) */
function parsePinCoords(latStr: string | null, lonStr: string | null): { lat: number; lon: number } | null {
  if (latStr === null || lonStr === null) return null
  const lat = Number(latStr)
  const lon = Number(lonStr)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat < 6 || lat > 38 || lon < 67 || lon > 98) return null
  return { lat, lon }
}

function jsonCached(data: unknown) {
  return NextResponse.json(data, {
    headers: { 'Cache-Control': CACHE_CONTROL },
  })
}

export async function GET(req: Request) {
  const limited = guardSolarGet(req)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const stateId = searchParams.get('stateId')
  const districtId = searchParams.get('districtId')
  if (!stateId) {
    return NextResponse.json({ error: 'stateId required' }, { status: 400 })
  }

  const latParam = searchParams.get('lat')
  const lonParam = searchParams.get('lon')
  if (latParam !== null || lonParam !== null) {
    if (latParam === null || lonParam === null) {
      return NextResponse.json({ error: 'lat and lon must be provided together' }, { status: 400 })
    }
    const pin = parsePinCoords(latParam, lonParam)
    if (!pin) {
      return NextResponse.json({ error: 'pin outside India or invalid coordinates' }, { status: 400 })
    }
  }
  const pin = parsePinCoords(latParam, lonParam)
  const c = pin ?? coordsForLocation(stateId, districtId)
  if (!c) {
    return NextResponse.json({ error: 'unknown location' }, { status: 404 })
  }

  const signal = upstreamSignal()
  const nrelKey = process.env.NREL_API_KEY
  if (nrelKey) {
    const nrel = await fetchNrelPvwattsSolar({
      lat: c.lat,
      lon: c.lon,
      apiKey: nrelKey,
      signal,
    })
    if (nrel) return jsonCached(nrel)
  }

  const nasa = await fetchNasaPowerClimatology(c.lat, c.lon, signal)
  if (nasa) return jsonCached(nasa)

  return jsonCached(fallbackSolar(c.lat))
}
