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
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
      {tabs.map((t) => {
        const is = t.id === active
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
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
  )
}
