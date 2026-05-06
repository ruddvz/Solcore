/** GitHub Pages / static deploy: `NEXT_PUBLIC_BASE_PATH` is e.g. `/repo-name` (no trailing slash). */
export function getPublicBasePath(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
}

/** Absolute URL path for same-origin API calls from the browser. */
export function withBasePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = getPublicBasePath()
  return `${base}${p}`
}
