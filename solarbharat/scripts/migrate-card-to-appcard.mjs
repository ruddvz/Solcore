#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

const files = []
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p)
    else if (/\.(tsx|ts)$/.test(name)) files.push(p)
  }
}
walk(root)

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8')
  if (!src.includes("@/components/ui/Card")) continue

  src = src.replace(
    /import \{ Card \} from '@\/components\/ui\/Card'/g,
    "import { AppCard } from '@/components/ui/AppCard'",
  )
  src = src.replace(/<Card accent="green"/g, '<AppCard variant="green"')
  src = src.replace(/<Card accent="blue"/g, '<AppCard variant="blue"')
  src = src.replace(/<Card accent="gold"/g, '<AppCard variant="solar"')
  src = src.replace(/<Card\b/g, '<AppCard')
  src = src.replace(/<\/Card>/g, '</AppCard>')

  fs.writeFileSync(file, src)
  console.log('migrated', path.relative(root, file))
}
