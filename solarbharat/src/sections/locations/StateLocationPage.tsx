'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import type { GeographyState } from '@/types'
import { withBasePath } from '@/lib/publicBasePath'

export function StateLocationPage({ state: st }: { state: GeographyState }) {
  const { t } = useTranslation()
  const q = new URLSearchParams({ stateId: st.id })
  const calcHref = `${withBasePath('/calculator')}?${q.toString()}`

  return (
    <div className="space-y-6">
      <p className="sb-overline text-sb-muted">{t('locations.crumb')}</p>
      <PageHeader title={st.name} subtitle={t('locations.stateBody', { state: st.name })} />
      <Link
        href={calcHref}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sb-gold px-5 py-3 text-base font-extrabold text-sb-ink hover:bg-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
      >
        {t('locations.openCalculator', { place: st.name })}
      </Link>
      <div className="rounded-xl border border-sb-line bg-sb-surface p-4">
        <div className="sb-overline text-sb-muted">{t('locations.districts')}</div>
        <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto text-base text-sb-ink-soft">
          {st.districts.map((d) => (
            <li key={d.id}>
              <Link
                className="rounded text-sb-blue underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
                href={withBasePath(`/locations/${st.id}/${d.id}`)}
              >
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink href="/locations" variant="secondary">
        {t('locations.allStates')}
      </ButtonLink>
    </div>
  )
}
