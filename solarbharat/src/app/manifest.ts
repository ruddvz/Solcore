import type { MetadataRoute } from 'next'

const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${base}/`,
    name: 'SolarBharat — India’s Solar Truth Engine',
    short_name: 'SolarBharat',
    description:
      'District-level solar feasibility for India — estimates only. PM-KUSUM-style modelling.',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait-primary',
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
  }
}
