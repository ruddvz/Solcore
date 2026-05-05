export function Pill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-sb-gold/30 bg-sb-bg/80 px-3 py-2 text-center">
      <div className="font-mono text-lg font-extrabold text-sb-gold">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide text-white/45">
        {label}
      </div>
    </div>
  )
}
