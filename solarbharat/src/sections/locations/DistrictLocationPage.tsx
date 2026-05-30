'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import type { GeographyDistrict, GeographyState } from '@/types'
import { withBasePath } from '@/lib/publicBasePath'

export function DistrictLocationPage({
  state: st,
  district: d,
}: {
  state: GeographyState
  district: GeographyDistrict
}) {
  const { t } = useTranslation()
  const q = new URLSearchParams({ stateId: st.id, districtId: d.id })
  const calcHref = `${withBasePath('/calculator')}?${q.toString()}`

  return (
    <div className="space-y-6">
      <p className="sb-overline text-white/50">{t('locations.crumb')}</p>
      <PageHeader
        title={t('locations.districtTitle', { district: d.name, state: st.name })}
        subtitle={t('locations.districtBody')}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          href={calcHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sb-gold px-5 py-3 text-base font-extrabold text-sb-bg hover:bg-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
        >
          {t('locations.calcDistrict')}
        </Link>
        <ButtonLink href={`/locations/${st.id}`} variant="secondary">
          {t('locations.allInState', { state: st.name })}
        </ButtonLink>
      </div>
    </div>
  )
}
