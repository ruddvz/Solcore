/**
 * Builds `public/data/india-geography.json` from:
 * 1) District list: iaseth/data-for-india — data/readable/districts.json (762 rows / 36 states)
 * 2) Coordinates: Photon (Komoot) geocoder — district + state + India
 * 3) Fallback centroids: geohacker/india — india_district.geojson (older GADM boundaries)
 *
 * Run: node scripts/build-geography.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const IASETH_DISTRICTS_URL =
  'https://raw.githubusercontent.com/iaseth/data-for-india/master/data/readable/districts.json'
const DISTRICT_GEOJSON_URL =
  'https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson'

function slug(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function downloadJson(url, label) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`)
  return res.json()
}

function ringCentroid(ring) {
  let sx = 0
  let sy = 0
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [x, y] = ring[i]
    sx += x
    sy += y
  }
  return { lon: sx / n, lat: sy / n }
}

function geometryCentroid(geom) {
  if (!geom) return null
  if (geom.type === 'Polygon') {
    const outer = geom.coordinates?.[0]
    if (!outer?.length) return null
    return ringCentroid(outer)
  }
  if (geom.type === 'MultiPolygon') {
    let best = null
    let bestA = -1
    for (const poly of geom.coordinates ?? []) {
      const outer = poly?.[0]
      if (!outer?.length) continue
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const [x, y] of outer) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
      const a = (maxX - minX) * (maxY - minY)
      if (a > bestA) {
        bestA = a
        best = ringCentroid(outer)
      }
    }
    return best
  }
  return null
}

function buildGadmCentroidMap(fc) {
  /** @type {Map<string, { lat: number, lon: number }>} */
  const m = new Map()
  for (const f of fc.features ?? []) {
    const p = f.properties ?? {}
    const stateName = p.NAME_1
    const districtName = p.NAME_2
    if (!stateName || !districtName) continue
    const c = geometryCentroid(f.geometry)
    if (!c) continue
    const key = `${norm(stateName)}||${norm(districtName)}`
    if (!m.has(key)) m.set(key, { lat: c.lat, lon: c.lon })
  }
  return m
}

async function photonGeocode(district, state, headquarters) {
  const cleanDistrict = district.replace(/\bdistrict\b/i, '').trim()
  const tryQueries = [
    `${district}, ${state}, India`,
    `${headquarters}, ${state}, India`,
    `${district} district, ${state}, India`,
    // Delhi revenue districts often resolve better as "..., Delhi, India"
    ...(norm(state).includes('delhi')
      ? [
          `${district}, Delhi, India`,
          `${cleanDistrict}, Delhi, India`,
          `${headquarters}, Delhi, India`,
        ]
      : []),
  ]
  for (const q of tryQueries) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lang=en`
    const res = await fetch(url)
    if (!res.ok) continue
    const j = await res.json()
    const feats = j.features ?? []
    const sN = norm(state)
    const dN = norm(district)
    const scored = feats
      .map((f) => {
        const p = f.properties ?? {}
        const st = norm(p.state)
        const nm = norm(p.name)
        const typ = `${p.type ?? ''}`
        let score = 0
        if (st && (st === sN || st.includes(sN) || sN.includes(st))) score += 6
        if (nm === dN) score += 12
        if (nm && (nm.includes(dN) || dN.includes(nm))) score += 4
        if (p.osm_key === 'boundary' && p.osm_value === 'administrative') score += 3
        if (typ.includes('county') || typ.includes('district')) score += 2
        if (p.countrycode && String(p.countrycode).toUpperCase() !== 'IN') score -= 10
        return { f, score }
      })
      .sort((a, b) => b.score - a.score)

    const best = scored[0]
    if (best && best.score >= 8) {
      const coords = best.f.geometry?.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        return { lon: coords[0], lat: coords[1], query: q, score: best.score }
      }
    }
  }
  return null
}

async function main() {
  console.log('Downloading iaseth districts list…')
  const iaseth = await downloadJson(IASETH_DISTRICTS_URL, 'iaseth')
  const rows = iaseth.districts ?? []
  if (!rows.length) throw new Error('iaseth districts.json missing `districts` array')

  console.log('Downloading legacy GADM GeoJSON for centroid fallback…')
  const fc = await downloadJson(DISTRICT_GEOJSON_URL, 'gadm geojson')
  const gadmMap = buildGadmCentroidMap(fc)

  /** @type {Map<string, { id: string, name: string, lat: number, lon: number, hq: string }[]>} */
  const byState = new Map()

  let photonOk = 0
  let gadmOk = 0
  let failed = 0

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const stateName = r.state
    const districtName = r.district
    const hq = r.headquarters ?? ''
    if (!stateName || !districtName) continue

    process.stdout.write(`\rGeocoding ${i + 1}/${rows.length} — ${districtName}, ${stateName}   `)

    let lat
    let lon
    let source = 'unknown'

    // Be polite to public geocoder
    await sleep(120)
    const pg = await photonGeocode(districtName, stateName, hq)
    if (pg) {
      lat = pg.lat
      lon = pg.lon
      source = 'photon.komoot.io'
      photonOk++
    } else {
      const gk = `${norm(stateName)}||${norm(districtName)}`
      const gc = gadmMap.get(gk)
      if (gc) {
        lat = gc.lat
        lon = gc.lon
        source = 'geohacker/india (GADM centroid fallback)'
        gadmOk++
      } else {
        failed++
        console.warn(`\nMissing coordinates for ${districtName}, ${stateName}`)
        continue
      }
    }

    if (!byState.has(stateName)) byState.set(stateName, [])
    byState.get(stateName).push({
      id: slug(districtName),
      name: districtName,
      lat: Math.round(lat * 1e6) / 1e6,
      lon: Math.round(lon * 1e6) / 1e6,
    })
  }

  const states = [...byState.entries()]
    .map(([stateName, districts]) => ({
      id: slug(stateName),
      name: stateName,
      districts: districts.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      districtList: {
        name: 'iaseth/data-for-india — data/readable/districts.json',
        url: IASETH_DISTRICTS_URL,
      },
      coordinates: {
        primary: 'Photon (Komoot) OpenStreetMap search — https://photon.komoot.io',
        fallback: {
          name: 'geohacker/india — district/india_district.geojson (GADM-derived centroid)',
          url: DISTRICT_GEOJSON_URL,
        },
      },
      stats: {
        districtsListed: rows.length,
        districtsWithCoordinates: states.reduce((n, s) => n + s.districts.length, 0),
        photonHits: photonOk,
        gadmFallbackHits: gadmOk,
        missing: failed,
      },
    },
    states,
  }

  const outDir = path.join(ROOT, 'src', 'data')
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'india-geography.json')
  fs.writeFileSync(outFile, JSON.stringify(payload))
  console.log(`\nWrote ${outFile}`)
  console.log(payload.meta.stats)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
