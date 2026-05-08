import type { Metadata } from 'next'
import Link from 'next/link'
import { getGeographyDistrict, getGeographyState, listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'

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

export default function DistrictLocationPage({ params }: { params: { stateId: string; districtId: string } }) {
  const st = getGeographyState(params.stateId)
  const d = getGeographyDistrict(params.stateId, params.districtId)
  if (!st || !d) return null
  const q = new URLSearchParams({ stateId: st.id, districtId: d.id })
  const calcHref = `${withBasePath('/calculator')}?${q.toString()}`

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-white/40">SolarBharat · Locations</p>
      <h1 className="font-heading text-3xl font-extrabold text-white">
        {d.name}, {st.name}
      </h1>
      <p className="text-sm text-white/65">
        District centroid coordinates feed NASA POWER / PVWatts when you run the calculator. Tariff and subsidy
        bands follow state policy tables — always verify with your DISCOM and nodal agency.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={calcHref}
          className="inline-flex rounded-xl bg-sb-gold px-5 py-3 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark"
        >
          Calculate for this district
        </Link>
        <Link
          href={withBasePath(`/locations/${st.id}`)}
          className="inline-flex rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/80 hover:border-white/30"
        >
          All districts in {st.name}
        </Link>
      </div>
    </div>
  )
}
