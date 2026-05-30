import { enforceRateLimit } from '@/lib/rateLimit'

const MINUTE = 60_000

export function guardPublicPost(req: Request, routeId: string): Response | null {
  return enforceRateLimit(req, routeId, 30, MINUTE)
}

export function guardSolarGet(req: Request): Response | null {
  return enforceRateLimit(req, 'solar-get', 120, MINUTE)
}
