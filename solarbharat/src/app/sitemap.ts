import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://solarbharat.in').replace(/\/$/, '')
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
  const base = `${baseUrl}${basePath}`
  const now = new Date()
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/report`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contractors`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/contractors/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
