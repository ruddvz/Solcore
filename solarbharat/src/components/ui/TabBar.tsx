export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="relative border-b border-white/10 pb-2">
      <div
        className="sb-nav-scroll flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-2 [-ms-overflow-style:none] [scrollbar-gutter:stable_both_edges] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent"
        role="tablist"
        aria-label="Sections"
      >
        {tabs.map((t) => {
          const is = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={is}
              onClick={() => onChange(t.id)}
              className={`shrink-0 snap-start rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                is
                  ? 'bg-sb-gold text-sb-bg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
