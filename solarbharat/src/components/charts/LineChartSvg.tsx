export function LineChartSvg({
  data,
  height = 220,
  stroke = '#fbbf24',
  referenceYear,
}: {
  data: { x: number; y: number }[]
  height?: number
  stroke?: string
  /** Plan0 §7 Tab 1 — vertical marker (e.g. year loan ends) */
  referenceYear?: number
}) {
  if (!data.length) return null
  const w = 600
  const pad = 24
  const ys = data.map((d) => d.y)
  const minY = Math.min(...ys, 0)
  const maxY = Math.max(...ys, 1)
  const xMin = data[0].x
  const xMax = data[data.length - 1].x
  const xScale = (x: number) => pad + ((x - xMin) / (xMax - xMin || 1)) * (w - pad * 2)
  const yScale = (y: number) =>
    height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2)

  const path = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x).toFixed(1)} ${yScale(d.y).toFixed(1)}`)
    .join(' ')

  const zeroY = yScale(0)

  const refX =
    referenceYear !== undefined && referenceYear >= xMin && referenceYear <= xMax
      ? xScale(referenceYear)
      : null

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="h-auto w-full" role="img" aria-label="Line chart">
      <line
        x1={pad}
        x2={w - pad}
        y1={zeroY}
        y2={zeroY}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      {refX !== null ? (
        <line
          x1={refX}
          x2={refX}
          y1={pad}
          y2={height - pad}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
      ) : null}
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.5" />
    </svg>
  )
}
