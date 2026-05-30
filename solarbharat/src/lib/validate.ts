const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  if (email.length < 5 || email.length > 254) return false
  return EMAIL_RE.test(email)
}

export function clampString(value: string, maxLen: number): string {
  const t = value.trim()
  return t.length <= maxLen ? t : t.slice(0, maxLen)
}

/** Avoid leaking Supabase internals to clients. */
export function publicApiError(fallback = 'Request failed'): string {
  return fallback
}
