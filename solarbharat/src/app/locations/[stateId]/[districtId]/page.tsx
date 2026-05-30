import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGeographyDistrict, getGeographyState, listGeographyStates } from '@/lib/region'
import { DistrictLocationPage } from '@/sections/locations/DistrictLocationPage'

export function generateStaticParams() {
  const out: { stateId: string; districtId: string }[] = []
  for (const s of listGeographyStates()) {
    for (const d of s.districts) {
      out.push({ stateId: s.id, districtId: d.id })
    }
  }
  return out
}

export function generateMetadata({
  params,
}: {
  params: { stateId: string; districtId: string }
}): Metadata {
  const st = getGeographyState(params.stateId)
  const d = getGeographyDistrict(params.stateId, params.districtId)
  const title = d && st ? `${d.name}, ${st.name} solar — SolarBharat` : 'District solar — SolarBharat'
  const desc =
    d && st
      ? `Solar resource and feasibility modelling for ${d.name} (${st.name}). Pre-select this district in the calculator.`
      : 'Solar district page — SolarBharat'
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
  }
}

export default function DistrictLocationRoute({
  params,
}: {
  params: { stateId: string; districtId: string }
}) {
  const st = getGeographyState(params.stateId)
  const d = getGeographyDistrict(params.stateId, params.districtId)
  if (!st || !d) notFound()
  return <DistrictLocationPage state={st} district={d} />
}
