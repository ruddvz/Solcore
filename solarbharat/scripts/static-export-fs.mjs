#!/usr/bin/env node
/**
 * Cross-filesystem-safe move for static export (rename fails with EXDEV on some mounts).
 */
import { cpSync, existsSync, rmSync } from 'node:fs'

export function movePath(src, dest) {
  if (!existsSync(src)) return false
  cpSync(src, dest, { recursive: true })
  rmSync(src, { recursive: true, force: true })
  return true
}

export function restorePath(backup, target) {
  if (!existsSync(backup)) return false
  if (existsSync(target)) {
    throw new Error(`restore: ${target} already exists`)
  }
  cpSync(backup, target, { recursive: true })
  rmSync(backup, { recursive: true, force: true })
  return true
}
