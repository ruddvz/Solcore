type Source = 'nrel_nsrdb' | 'nasa_power' | 'heuristic' | string

const styles: Record<string, string> = {
  nrel_nsrdb: 'bg-sb-green/15 text-sb-green',
  nasa_power: 'bg-sb-blue/15 text-sb-blue',
  heuristic: 'bg-sb-orange/15 text-sb-orange',
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
  const cls = styles[source] ?? 'bg-white/10 text-white/70'
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${cls}`}>
        {label}
      </span>
      {confidence ? (
        <span className="text-[11px] font-medium text-white/50">{confidence}</span>
      ) : null}
    </span>
  )
}
