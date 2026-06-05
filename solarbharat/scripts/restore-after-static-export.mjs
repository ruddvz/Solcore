#!/usr/bin/env node
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { restorePath } from './static-export-fs.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const paths = {
  api: join(root, 'src/app/api'),
  apiBackup: join(root, '.static-export-backup-api'),
  mw: join(root, 'middleware.ts'),
  mwBackup: join(root, '.static-export-backup-middleware.ts'),
}

try {
  if (restorePath(paths.apiBackup, paths.api)) {
    console.log('Restored src/app/api')
  }

  if (restorePath(paths.mwBackup, paths.mw)) {
    console.log('Restored middleware.ts')
  }
} catch (err) {
  console.error(String(err))
  process.exit(1)
}
