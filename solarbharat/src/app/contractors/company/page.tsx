import { Suspense } from 'react'
import { ContractorCompanyPage } from '@/sections/ContractorCompanyPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-white/65">Loading…</div>}>
      <ContractorCompanyPage />
    </Suspense>
  )
}
