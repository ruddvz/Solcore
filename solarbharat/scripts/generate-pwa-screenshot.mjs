/**
 * Plan0 §6 — generate a minimal PWA screenshot (390×844) for manifest.
 * Run: node scripts/generate-pwa-screenshot.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/screenshots')
const outFile = path.join(outDir, 'mobile.png')

await fs.promises.mkdir(outDir, { recursive: true })

const width = 390
const height = 844
const bg = { r: 10, g: 15, b: 30 }

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: bg,
  },
})
  .png()
  .toFile(outFile)

console.log('Wrote', outFile)
