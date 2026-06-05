export function FundingStack({
  parts,
}: {
  parts: { label: string; amountRs: number; color: string }[]
}) {
  const total = parts.reduce((s, p) => s + p.amountRs, 0) || 1
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-sb-line">
        {parts.map((p) => (
          <div
            key={p.label}
            style={{ width: `${(p.amountRs / total) * 100}%`, backgroundColor: p.color }}
            title={`${p.label}: ${p.amountRs}`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center gap-2 text-sb-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="font-bold text-sb-ink-soft">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
