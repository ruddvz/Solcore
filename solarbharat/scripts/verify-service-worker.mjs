/**
 * Smoke-check PWA artifacts after production build.
 * Run: node scripts/verify-service-worker.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const sw = path.join(publicDir, 'sw.js')
const icons = ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-512-maskable.png']
const screenshots = ['screenshots/mobile.png']

let failed = false

if (!fs.existsSync(sw)) {
  console.error('Missing service worker:', sw, '(run npm run build first)')
  failed = true
} else {
  const stat = fs.statSync(sw)
  if (stat.size < 100) {
    console.error('Service worker file suspiciously small')
    failed = true
  } else {
    console.log('OK service worker', sw, `(${stat.size} bytes)`)
  }
}

for (const rel of [...icons, ...screenshots]) {
  const p = path.join(publicDir, rel)
  if (!fs.existsSync(p)) {
    console.error('Missing asset:', rel)
    failed = true
    continue
  }
  const size = fs.statSync(p).size
  if (rel.includes('screenshots') && size < 5000) {
    console.error(`${rel} is too small (${size} bytes) — likely blank placeholder`)
    failed = true
  } else {
    console.log('OK', rel, `(${size} bytes)`)
  }
}

process.exit(failed ? 1 : 0)
