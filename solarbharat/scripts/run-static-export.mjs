#!/usr/bin/env node
/**
 * Full GitHub Pages static export: temporarily remove API routes, build, post-process, restore.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function run(cmd, args, extraEnv = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
    shell: process.platform === 'win32',
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

try {
  run(process.execPath, ['scripts/prepare-static-export.mjs'])
  run('npx', ['next', 'build'], { STATIC_EXPORT: '1' })
  if (!existsSync(join(root, 'out'))) {
    console.error('run-static-export: out/ missing after build')
    process.exit(1)
  }
  run(process.execPath, ['scripts/post-static-export.mjs'])
} finally {
  run(process.execPath, ['scripts/restore-after-static-export.mjs'])
}

console.log('Static export ready in solarbharat/out/')
