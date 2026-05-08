import { NextRequest } from 'next/server'

/** Shared secret for Vercel Cron / GitHub Actions hitting /api/cron/* */
export function assertCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return auth.slice(7) === secret
}

export function assertModerationSecret(req: NextRequest): boolean {
  const secret = process.env.MODERATION_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return auth.slice(7) === secret
}
