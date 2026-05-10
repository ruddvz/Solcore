import type { MetadataRoute } from 'next'

const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${base}/`,
    name: 'SolarBharat',
    short_name: 'SolarBharat',
    description: "India's Solar Intelligence Platform — district-level feasibility (estimates only).",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0f1e',
    theme_color: '#0a0f1e',
    categories: ['utilities', 'finance', 'productivity'],
    icons: [
      {
        src: `${base}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${base}/icons/icon-192-maskable.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `${base}/icons/icon-384.png`,
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: `${base}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${base}/icons/icon-512-maskable.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: `${base}/screenshots/mobile.png`,
        sizes: '390x844',
        type: 'image/png',
      },
    ],
  }
}
