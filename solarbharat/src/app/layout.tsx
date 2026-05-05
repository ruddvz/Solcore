import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Layout } from '@/components/layout/Layout'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
/** Trailing slash helps relative manifest / icon URLs on GitHub Pages project sites */
const metadataOrigin =
  basePath === '' ? `${siteUrl}/` : `${siteUrl}${basePath}/`

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
}

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin || siteUrl),
  applicationName: 'SolarBharat',
  title: 'SolarBharat — India’s Solar Truth Engine',
  description:
    'District-level solar feasibility for India: NASA POWER irradiance, honest capex stack, PM-KUSUM-style subsidies — estimates only.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SolarBharat',
  },
  icons: {
    icon: [
      { url: `${metadataOrigin}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${metadataOrigin}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
    apple: `${metadataOrigin}icons/icon-192.png`,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'SolarBharat',
    description: 'District-level solar feasibility for India.',
    type: 'website',
    url: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="manifest"
          href={`${basePath}/manifest.webmanifest`.replace(/\/{2,}/g, '/')}
          crossOrigin="use-credentials"
        />
      </head>
      <body className="min-h-screen bg-sb-bg font-sans antialiased">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
