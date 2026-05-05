#!/usr/bin/env node
/**
 * Static export cannot include Route Handlers. Temporarily move `src/app/api` and root `middleware.ts`.
 */
import { existsSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const paths = {
  api: join(root, 'src/app/api'),
  apiBackup: join(root, '.static-export-backup-api'),
  mw: join(root, 'middleware.ts'),
  mwBackup: join(root, '.static-export-backup-middleware.ts'),
}

if (existsSync(paths.apiBackup) || existsSync(paths.mwBackup)) {
  console.error('prepare-static-export: backup already exists — run restore-after-static-export.mjs first')
  process.exit(1)
}

if (existsSync(paths.api)) {
  renameSync(paths.api, paths.apiBackup)
  console.log('Moved src/app/api → .static-export-backup-api')
}

if (existsSync(paths.mw)) {
  renameSync(paths.mw, paths.mwBackup)
  console.log('Moved middleware.ts → .static-export-backup-middleware.ts')
}
