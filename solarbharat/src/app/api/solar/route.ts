import { NextResponse } from 'next/server'
import { coordsForLocation, fallbackSolar } from '@/lib/region'
import { fetchNasaPowerClimatology } from '@/lib/nasaPowerSolar'
import { fetchNrelPvwattsSolar } from '@/lib/nrelSolar'

/** Rough India bounding box for pin validation (plan §6.1 — lat/lon query) */
function parsePinCoords(latStr: string | null, lonStr: string | null): { lat: number; lon: number } | null {
  if (latStr === null || lonStr === null) return null
  const lat = Number(latStr)
  const lon = Number(lonStr)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat < 6 || lat > 38 || lon < 67 || lon > 98) return null
  return { lat, lon }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const stateId = searchParams.get('stateId')
  const districtId = searchParams.get('districtId')
  if (!stateId) {
    return NextResponse.json({ error: 'stateId required' }, { status: 400 })
  }

  const pin = parsePinCoords(searchParams.get('lat'), searchParams.get('lon'))
  const c = pin ?? coordsForLocation(stateId, districtId)
  if (!c) {
    return NextResponse.json({ error: 'unknown location' }, { status: 404 })
  }

  const nrelKey = process.env.NREL_API_KEY
  if (nrelKey) {
    const nrel = await fetchNrelPvwattsSolar({ lat: c.lat, lon: c.lon, apiKey: nrelKey })
    if (nrel) return NextResponse.json(nrel)
  }

  const nasa = await fetchNasaPowerClimatology(c.lat, c.lon)
  if (nasa) return NextResponse.json(nasa)

  return NextResponse.json(fallbackSolar(c.lat))
}
