const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

export function MonthBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 0.0001)
  return (
    <div className="flex h-28 items-end gap-1">
      {values.map((v, i) => {
        const h = Math.round((v / max) * 100)
        const season =
          i >= 2 && i <= 4 ? 'bg-sb-gold' : i >= 5 && i <= 8 ? 'bg-sb-blue' : 'bg-sb-green'
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full max-w-[14px] rounded-t ${season}`}
              style={{ height: `${Math.max(8, h)}%` }}
              title={`${MONTHS[i]}: ${v.toFixed(2)}`}
            />
            <span className="text-[9px] text-sb-muted2">{MONTHS[i]}</span>
          </div>
        )
      })}
    </div>
  )
}
