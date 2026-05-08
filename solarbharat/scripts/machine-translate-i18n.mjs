/**
 * Fills hi.json / gu.json from en.json using the public Google Translate "gtx" endpoint.
 * Run from repo root: cd solarbharat && npm run i18n:translate
 * Cache: scripts/.i18n-translate-cache.json (gitignored) to avoid re-billing strings on re-run.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/i18n/locales')
const enPath = path.join(localesDir, 'en.json')
const cachePath = path.join(__dirname, '.i18n-translate-cache.json')

const DELAY_MS = 90

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8')
}

function loadCache() {
  try {
    return loadJson(cachePath)
  } catch {
    return {}
  }
}

function saveCache(c) {
  fs.writeFileSync(cachePath, JSON.stringify(c, null, 0), 'utf8')
}

async function gtx(text, tl) {
  const u = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(u)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data[0].map((x) => x[0]).join('')
}

async function translateString(text, tl, cache) {
  if (typeof text !== 'string' || !text.trim()) return text
  const key = `${tl}::${text}`
  if (cache[key]) return cache[key]

  const ph = []
  const masked = text.replace(/\{\{[^}]+\}\}/g, (m) => {
    ph.push(m)
    return `⟦${ph.length - 1}⟧`
  })

  await new Promise((r) => setTimeout(r, DELAY_MS))
  let out = await gtx(masked, tl)
  out = out.replace(/⟦(\d+)⟧/g, (_, i) => ph[Number(i)])
  cache[key] = out
  return out
}

async function walk(obj, tl, cache) {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return translateString(obj, tl, cache)
  if (Array.isArray(obj)) {
    const out = []
    for (const item of obj) {
      out.push(await walk(item, tl, cache))
    }
    return out
  }
  if (typeof obj === 'object') {
    const out = {}
    for (const k of Object.keys(obj)) {
      out[k] = await walk(obj[k], tl, cache)
    }
    return out
  }
  return obj
}

async function main() {
  const en = loadJson(enPath)
  let cache = loadCache()

  console.log('Translating to hi…')
  const hi = await walk(en, 'hi', cache)
  saveJson(path.join(localesDir, 'hi.json'), hi)
  saveCache(cache)

  console.log('Translating to gu…')
  const gu = await walk(en, 'gu', cache)
  saveJson(path.join(localesDir, 'gu.json'), gu)
  saveCache(cache)

  console.log('Done. Updated hi.json and gu.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
