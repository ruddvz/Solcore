'use client'

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'

const SECTIONS = ['phase1', 'phase2', 'scalePhase', 'manual'] as const

export function RoadmapPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader title={t('roadmap.title')} subtitle={t('roadmap.intro')} />

      {SECTIONS.map((key) => (
        <section
          key={key}
          className="rounded-2xl border border-white/10 bg-sb-surface/40 p-6"
          aria-labelledby={`roadmap-${key}-heading`}
        >
          <h2 id={`roadmap-${key}-heading`} className="text-lg font-extrabold text-sb-gold">
            {t(`roadmap.${key}.title`)}
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-white/75">
            {(t(`roadmap.${key}.items`, { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-sm text-white/50">{t('roadmap.footer')}</p>
    </div>
  )
}
