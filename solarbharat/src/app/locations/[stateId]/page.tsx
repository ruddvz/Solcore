import type { Metadata } from 'next'
import Link from 'next/link'
import { getGeographyState, listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'

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

export default function StateLocationPage({ params }: { params: { stateId: string } }) {
  const st = getGeographyState(params.stateId)
  if (!st) return null
  const q = new URLSearchParams({ stateId: st.id })
  const calcHref = `${withBasePath('/calculator')}?${q.toString()}`

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-white/40">SolarBharat · Locations</p>
      <h1 className="font-heading text-3xl font-extrabold text-white">{st.name}</h1>
      <p className="text-sm text-white/65">
        Explore solar feasibility for any district in {st.name}. We use district centroids for irradiance and
        apply Plan0-style conservative finance — estimates only, not DISCOM advice.
      </p>
      <Link
        href={calcHref}
        className="inline-flex rounded-xl bg-sb-gold px-5 py-3 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark"
      >
        Open calculator — {st.name}
      </Link>
      <div className="rounded-xl border border-white/10 bg-sb-surface/60 p-4">
        <div className="text-xs font-extrabold uppercase text-white/45">Districts</div>
        <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto text-sm text-white/75">
          {st.districts.map((d) => (
            <li key={d.id}>
              <Link className="text-sb-blue hover:underline" href={withBasePath(`/locations/${st.id}/${d.id}`)}>
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
