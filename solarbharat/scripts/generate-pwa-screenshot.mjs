/**
 * Generate PWA manifest screenshots (390×844) with visible UI chrome — not a blank slab.
 * Run: node scripts/generate-pwa-screenshot.mjs
 * Fails if output is suspiciously small or one-color.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/screenshots')
const MIN_BYTES = 8000

const width = 390
const height = 844
const bg = '#0a0f1e'

function buildSvg(title, subtitle) {
  return Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1a2e"/>
      <stop offset="100%" stop-color="#0a0f1e"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  <rect x="0" y="0" width="390" height="120" fill="url(#hero)"/>
  <text x="24" y="52" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="14" font-weight="700">☀ SolarBharat</text>
  <text x="24" y="88" fill="#ffffff" font-family="system-ui,sans-serif" font-size="22" font-weight="800">${title}</text>
  <rect x="24" y="140" width="342" height="200" rx="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
  <text x="40" y="180" fill="rgba(255,255,255,0.9)" font-family="system-ui,sans-serif" font-size="16" font-weight="700">${subtitle}</text>
  <rect x="40" y="200" width="310" height="44" rx="12" fill="rgba(255,255,255,0.08)"/>
  <rect x="40" y="256" width="310" height="44" rx="12" fill="rgba(255,255,255,0.08)"/>
  <rect x="40" y="312" width="180" height="48" rx="14" fill="#fbbf24"/>
  <text x="58" y="342" fill="#0a0f1e" font-family="system-ui,sans-serif" font-size="14" font-weight="800">Calculate potential</text>
  <rect x="24" y="380" width="160" height="72" rx="16" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.3)"/>
  <rect x="196" y="380" width="170" height="72" rx="16" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.25)"/>
  <text x="40" y="410" fill="#86efac" font-family="system-ui,sans-serif" font-size="11" font-weight="700">DISTRICT DATA</text>
  <text x="212" y="410" fill="#fbbf24" font-family="system-ui,sans-serif" font-size="11" font-weight="700">PAYBACK MODEL</text>
</svg>`)
}

async function writeScreenshot(name, title, subtitle) {
  const outFile = path.join(outDir, name)
  await sharp(buildSvg(title, subtitle)).png().toFile(outFile)
  const stat = await fs.promises.stat(outFile)
  if (stat.size < MIN_BYTES) {
    throw new Error(`${name} too small (${stat.size} bytes) — regenerate with richer content`)
  }
  console.log('Wrote', outFile, `(${stat.size} bytes)`)
}

await fs.promises.mkdir(outDir, { recursive: true })
await writeScreenshot(
  'mobile.png',
  'Solar feasibility for your district',
  'State → District → Estimate',
)
await writeScreenshot(
  'mobile-home.png',
  "India's Solar Intelligence",
  'Transparent assumptions',
)
await writeScreenshot(
  'mobile-calculator.png',
  'Calculator',
  'Land · Technology · Map',
)
