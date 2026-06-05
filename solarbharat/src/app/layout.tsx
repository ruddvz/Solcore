import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { AppShell } from '@/components/layout/AppShell'
import { IosInstallPrompt } from '@/components/pwa/IosInstallPrompt'
import { PwaUpdatePrompt } from '@/components/pwa/PwaUpdatePrompt'

const fontSyne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
})

const fontDmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['400', '500', '700'],
})

const fontJetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jb-mono',
  weight: ['400', '700'],
})

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')
/** Trailing slash helps relative manifest / icon URLs on GitHub Pages project sites */
const metadataOrigin =
  basePath === '' ? `${siteUrl}/` : `${siteUrl}${basePath}/`

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
    <html lang="en" className={`${fontSyne.variable} ${fontDmSans.variable} ${fontJetbrains.variable}`}>
      <head>
        <link
          rel="manifest"
          href={`${basePath}/manifest.webmanifest`.replace(/\/{2,}/g, '/')}
          crossOrigin="use-credentials"
        />
      </head>
      <body className="min-h-screen bg-sb-bg font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
          <IosInstallPrompt />
          <PwaUpdatePrompt />
        </Providers>
      </body>
    </html>
  )
}
