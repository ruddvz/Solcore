'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'

export function LocationsIndexPage() {
  const { t } = useTranslation()
  const states = listGeographyStates()
  return (
    <div className="space-y-6">
      <PageHeader title={t('locations.title')} subtitle={t('locations.subtitle')} />
      <ul className="columns-1 gap-x-10 text-base text-white/80 md:columns-2 lg:columns-3">
        {states.map((s) => (
          <li key={s.id} className="break-inside-avoid py-1.5">
            <Link
              className="rounded font-bold text-sb-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
              href={withBasePath(`/locations/${s.id}`)}
            >
              {s.name}
            </Link>
            <span className="text-white/70">
              {' '}
              · {t('locations.districtCount', { count: s.districts.length })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
