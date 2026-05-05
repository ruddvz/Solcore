import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://solarbharat.in').replace(/\/$/, '')
  const now = new Date()
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/report`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]
}
