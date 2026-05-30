import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGeographyState, listGeographyStates } from '@/lib/region'
import { StateLocationPage } from '@/sections/locations/StateLocationPage'

export function generateStaticParams() {
  return listGeographyStates().map((s) => ({ stateId: s.id }))
}

export function generateMetadata({ params }: { params: { stateId: string } }): Metadata {
  const st = getGeographyState(params.stateId)
  const name = st?.name ?? params.stateId
  return {
    title: `${name} solar feasibility — SolarBharat`,
    description: `District-level solar irradiance, subsidy stack, and honest capex modelling for ${name}. Open the calculator with ${name} pre-selected.`,
    openGraph: {
      title: `${name} — SolarBharat`,
      description: `Solar feasibility context for ${name}, India.`,
    },
  }
}

export default function StateLocationRoute({ params }: { params: { stateId: string } }) {
  const st = getGeographyState(params.stateId)
  if (!st) notFound()
  return <StateLocationPage state={st} />
}
