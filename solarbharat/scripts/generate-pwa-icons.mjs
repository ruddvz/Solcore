#!/usr/bin/env node
/**
 * Writes PNG icons into public/icons/ for Web App Manifest + PWA install prompts.
 * Requires: sharp (devDependency)
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'icons')

const BG = '#0a0f1e'
const GOLD = '#fbbf24'

function buildSvg(size, maskable) {
  const rx = maskable ? size * 0.18 : 0
  const cx = size / 2
  const cy = size / 2
  const rSun = Math.round(size * 0.14)
  const rays =
    size >= 128
      ? Array.from({ length: 8 }, (_, i) => {
          const ang = (i * Math.PI) / 4 - Math.PI / 2
          const inner = rSun + Math.round(size * 0.05)
          const outer = rSun + Math.round(size * 0.16)
          const x1 = cx + inner * Math.cos(ang)
          const y1 = cy + inner * Math.sin(ang)
          const x2 = cx + outer * Math.cos(ang)
          const y2 = cy + outer * Math.sin(ang)
          const sw = Math.max(2, Math.round(size / 80))
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round"/>`
        }).join('\n      ')
      : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}" rx="${rx}"/>
  ${rays}
  <circle cx="${cx}" cy="${cy}" r="${rSun}" fill="${GOLD}"/>
</svg>`
}

async function writePng(name, size, maskable) {
  const svg = buildSvg(size, maskable)
  const buf = await sharp(Buffer.from(svg)).png().toBuffer()
  await writeFile(join(outDir, name), buf)
  console.log(`Wrote ${name}`)
}

await mkdir(outDir, { recursive: true })
await writePng('icon-192.png', 192, false)
await writePng('icon-192-maskable.png', 192, true)
await writePng('icon-384.png', 384, false)
await writePng('icon-512.png', 512, false)
await writePng('icon-512-maskable.png', 512, true)
