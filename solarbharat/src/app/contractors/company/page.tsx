import { Suspense } from 'react'
import { ContractorCompanyPage } from '@/sections/ContractorCompanyPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-sb-muted">Loading…</div>}>
      <ContractorCompanyPage />
    </Suspense>
  )
}
