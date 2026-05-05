import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Layout } from '@/components/layout/Layout'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SolarBharat — India’s Solar Truth Engine',
  description:
    'District-level solar feasibility for India: NASA POWER irradiance, honest capex stack, PM-KUSUM-style subsidies — estimates only.',
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
