import { timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

function readBearer(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

/** Shared secret for Vercel Cron / GitHub Actions hitting /api/cron/* */
export function assertCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const token = readBearer(req)
  if (!token) return false
  return safeEqual(token, secret)
}

export function assertModerationSecret(req: NextRequest): boolean {
  const secret = process.env.MODERATION_SECRET
  if (!secret) return false
  const token = readBearer(req)
  if (!token) return false
  return safeEqual(token, secret)
}
