export function Pill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-sb-gold/30 bg-sb-bg/80 px-3 py-2 text-center">
      <div className="font-mono text-[22px] font-bold text-sb-gold">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/45">
        {label}
      </div>
    </div>
  )
}
