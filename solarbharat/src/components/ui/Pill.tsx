export function Pill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-sb-md border border-sb-gold/30 bg-sb-goldFaint px-3 py-2 text-center">
      <div className="sb-tabular font-mono text-[22px] font-bold text-sb-ink">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-sb-muted">
        {label}
      </div>
    </div>
  )
}
