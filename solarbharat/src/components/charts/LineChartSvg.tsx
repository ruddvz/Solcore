export function LineChartSvg({
  data,
  height = 220,
  stroke = '#fbbf24',
}: {
  data: { x: number; y: number }[]
  height?: number
  stroke?: string
}) {
  if (!data.length) return null
  const w = 600
  const pad = 24
  const ys = data.map((d) => d.y)
  const minY = Math.min(...ys, 0)
  const maxY = Math.max(...ys, 1)
  const xScale = (x: number) =>
    pad + ((x - data[0].x) / (data[data.length - 1].x - data[0].x || 1)) * (w - pad * 2)
  const yScale = (y: number) =>
    height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2)

  const path = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x).toFixed(1)} ${yScale(d.y).toFixed(1)}`)
    .join(' ')

  const zeroY = yScale(0)

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
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.5" />
    </svg>
  )
}
