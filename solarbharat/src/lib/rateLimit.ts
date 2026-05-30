/**
 * In-memory sliding-window rate limit for serverless API routes.
 * Resets on cold start; use Vercel Firewall / Redis for strict production limits.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number }

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }
  bucket.count += 1
  return { ok: true }
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export function rateLimitResponse(retryAfterSec: number): Response {
  return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfterSec),
    },
  })
}

/** Apply limit; returns Response to return early, or null if allowed. */
export function enforceRateLimit(
  req: Request,
  routeId: string,
  limit: number,
  windowMs: number,
): Response | null {
  const ip = clientIp(req)
  const result = checkRateLimit(`${routeId}:${ip}`, limit, windowMs)
  if (!result.ok) return rateLimitResponse(result.retryAfterSec)
  return null
}
