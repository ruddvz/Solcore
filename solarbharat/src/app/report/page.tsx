import { Suspense } from 'react'
import { ReportPage } from '@/sections/ReportPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReportPage />
    </Suspense>
  )
}
