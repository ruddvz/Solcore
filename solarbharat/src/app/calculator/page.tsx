import { CalculatorPage } from '@/sections/CalculatorPage'

export default function Page({
  searchParams,
}: {
  searchParams: { stateId?: string; districtId?: string }
}) {
  return (
    <CalculatorPage
      initialStateId={searchParams.stateId ?? null}
      initialDistrictId={searchParams.districtId ?? null}
    />
  )
}
