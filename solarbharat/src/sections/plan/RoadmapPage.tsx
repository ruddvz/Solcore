'use client'

import { useTranslation } from 'react-i18next'

const SECTIONS = ['phase1', 'phase2', 'scalePhase', 'manual'] as const

export function RoadmapPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white">{t('roadmap.title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{t('roadmap.intro')}</p>
      </div>

      {SECTIONS.map((key) => (
        <section key={key} className="rounded-2xl border border-white/10 bg-sb-surface/40 p-6">
          <h2 className="text-lg font-extrabold text-sb-gold">{t(`roadmap.${key}.title`)}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-white/75">
            {(t(`roadmap.${key}.items`, { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-white/40">{t('roadmap.footer')}</p>
    </div>
  )
}
