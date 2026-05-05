import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-16 text-center">
      <div className="text-5xl">📡</div>
      <h1 className="text-2xl font-black text-white">You are offline</h1>
      <p className="text-sm text-white/60">
        SolarBharat needs a network connection for fresh irradiance data and reports. Cached pages may still open
        when you reconnect.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-xl bg-sb-gold px-5 py-2.5 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark"
      >
        Try again
      </Link>
    </div>
  )
}
