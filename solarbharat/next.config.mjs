import withPWAInit from '@ducanh2912/next-pwa'

const isStaticExport = process.env.STATIC_EXPORT === '1'
const basePathRaw = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim()
const basePath = basePathRaw === '/' ? '' : basePathRaw

const withPWA = withPWAInit({
  dest: 'public',
  /** Service worker + precache only in production builds; skip for static export (GitHub Pages) */
  disable: process.env.NODE_ENV === 'development' || isStaticExport,
  register: true,
  skipWaiting: true,
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/power\.larc\.nasa\.gov\/api\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'nasa-power',
          expiration: { maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'google-fonts' },
      },
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}),
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
}

export default withPWA(nextConfig)
