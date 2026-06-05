import { Suspense } from 'react'
import { CalculatorPage } from '@/sections/CalculatorPage'

/** Static-export safe: query params are read client-side in CalculatorPage. */
export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-8 text-sm text-white/70" role="status">
          Loading calculator…
        </p>
      }
    >
      <CalculatorPage />
    </Suspense>
  )
}
