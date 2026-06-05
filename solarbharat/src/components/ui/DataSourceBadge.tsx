type Source = 'nrel_nsrdb' | 'nasa_power' | 'heuristic' | string

const dotStyles: Record<string, string> = {
  nrel_nsrdb: 'bg-sb-green',
  nasa_power: 'bg-sb-blue',
  heuristic: 'bg-sb-orange',
}

export function DataSourceBadge({
  source,
  label,
  confidence,
}: {
  source: Source
  label: string
  confidence?: string
}) {
  const dot = dotStyles[source] ?? 'bg-sb-muted'
  const text = confidence ? `${label} · ${confidence}` : label
  return (
    <span className="inline-flex h-7 max-w-full items-center gap-2 rounded-sb-pill border border-[var(--sb-line)] bg-sb-surface-solid px-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      <span className="truncate text-[12px] font-bold text-sb-ink-soft">{text}</span>
    </span>
  )
}
