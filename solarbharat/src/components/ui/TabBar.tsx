'use client'

import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export function TabBar({
  tabs,
  active,
  onChange,
  ariaLabel,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
  ariaLabel?: string
}) {
  const { t } = useTranslation()
  const listRef = useRef<HTMLDivElement>(null)
  const label = ariaLabel ?? t('a11y.sections')

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
      else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = tabs.length - 1
      else return
      e.preventDefault()
      onChange(tabs[next].id)
      const btn = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]
      btn?.focus()
    },
    [onChange, tabs],
  )

  return (
    <div className="relative border-b border-white/10 pb-2">
      <div
        ref={listRef}
        className="sb-nav-scroll flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-2"
        role="tablist"
        aria-label={label}
      >
        {tabs.map((tab, index) => {
          const is = tab.id === active
          const tabId = `tab-${tab.id}`
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={is}
              tabIndex={is ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, index)}
              onClick={() => onChange(tab.id)}
              className={`min-h-[44px] shrink-0 snap-start rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold ${
                is
                  ? 'bg-sb-gold text-sb-bg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
