/** Slugify title for forum URLs — ASCII-safe fallback */

export function slugify(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return base || `topic-${Date.now()}`
}
