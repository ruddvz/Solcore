import type { Metadata } from 'next'
import Link from 'next/link'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'

export const metadata: Metadata = {
  title: 'Solar by state & district — SolarBharat',
  description: 'Browse Indian states and districts for solar feasibility context and open the calculator pre-filled.',
}

export default function LocationsIndexPage() {
  const states = listGeographyStates()
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-extrabold text-white">States & districts</h1>
      <p className="max-w-2xl text-sm text-white/65">
        Each page links to the calculator with the right geography selected. District URLs help search engines
        discover local solar intent; numbers in the app remain estimates only.
      </p>
      <ul className="columns-1 gap-x-10 text-sm text-white/80 md:columns-2 lg:columns-3">
        {states.map((s) => (
          <li key={s.id} className="break-inside-avoid py-1">
            <Link className="font-bold text-sb-gold hover:underline" href={withBasePath(`/locations/${s.id}`)}>
              {s.name}
            </Link>
            <span className="text-white/40"> · {s.districts.length} districts</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
