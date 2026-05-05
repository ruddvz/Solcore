#!/usr/bin/env node
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

if (existsSync(paths.apiBackup)) {
  if (existsSync(paths.api)) {
    console.error('restore: src/app/api already exists')
    process.exit(1)
  }
  renameSync(paths.apiBackup, paths.api)
  console.log('Restored src/app/api')
}

if (existsSync(paths.mwBackup)) {
  if (existsSync(paths.mw)) {
    console.error('restore: middleware.ts already exists')
    process.exit(1)
  }
  renameSync(paths.mwBackup, paths.mw)
  console.log('Restored middleware.ts')
}
