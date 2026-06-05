'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background:
            'radial-gradient(circle at 50% -120px, rgba(244, 179, 33, 0.24), transparent 360px), linear-gradient(180deg, #FFF8DF 0%, #F8F2E5 42%, #F4ECD9 100%)',
          color: '#132015',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <main
          style={{
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            borderRadius: 30,
            border: '1px solid rgba(19, 32, 21, 0.10)',
            background: 'rgba(255, 253, 247, 0.92)',
            padding: '28px 24px',
            boxShadow: '0 10px 32px rgba(39, 31, 15, 0.10)',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#69746B', margin: 0 }}>
            SolarBharat
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 760, margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, lineHeight: '22px', color: '#314036', margin: '0 0 20px' }}>
            The app hit an unexpected error. You can try again or return home.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 48,
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(180deg, #F8C443 0%, #F4B321 100%)',
                color: '#132015',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="./"
              style={{
                minHeight: 48,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                border: '1px solid rgba(19, 32, 21, 0.12)',
                background: '#FFFFFF',
                color: '#132015',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <p style={{ marginTop: 16, fontSize: 12, color: '#909A91', wordBreak: 'break-word' }}>
              {error.message}
            </p>
          )}
        </main>
      </body>
    </html>
  )
}
