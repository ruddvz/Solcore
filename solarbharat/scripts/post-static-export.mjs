#!/usr/bin/env node
/**
 * GitHub Pages (Jekyll) ignores paths starting with `_`; disable with `.nojekyll`.
 * Next.js `basePath` already matches `https://<user>.github.io/<repo>/` — do not nest output.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '..', 'out')
writeFileSync(join(out, '.nojekyll'), '')
console.log('Wrote out/.nojekyll')
