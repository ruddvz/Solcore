import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Layout } from '@/components/layout/Layout'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'SolarBharat',
  title: 'SolarBharat — India’s Solar Truth Engine',
  description:
    'District-level solar feasibility for India: NASA POWER irradiance, honest capex stack, PM-KUSUM-style subsidies — estimates only.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SolarBharat',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
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
      <body className="min-h-screen bg-sb-bg font-sans antialiased">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
