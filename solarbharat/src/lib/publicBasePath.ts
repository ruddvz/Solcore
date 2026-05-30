/** GitHub Pages / static deploy: `NEXT_PUBLIC_BASE_PATH` is e.g. `/repo-name` (no trailing slash). */
export function getPublicBasePath(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
}

/** Absolute URL path for same-origin links and API calls from the browser. */
export function withBasePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = getPublicBasePath()
  return `${base}${p}`
}

/** Strip deploy base path from `usePathname()` for route matching. */
export function stripBasePath(pathname: string): string {
  const base = getPublicBasePath()
  if (!base) return pathname || '/'
  if (pathname === base) return '/'
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length) || '/'
  return pathname
}

export function isActivePath(pathname: string, href: string): boolean {
  const p = stripBasePath(pathname)
  const h = href === '/' ? '/' : href.replace(/\/$/, '')
  if (h === '/') return p === '/' || p === ''
  return p === h || p.startsWith(`${h}/`)
}
