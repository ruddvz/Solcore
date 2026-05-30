export function DonutSvg({
  segments,
  size = 200,
  ariaLabel,
}: {
  segments: { value: number; color: string; label?: string }[]
  size?: number
  ariaLabel: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  const inner = r * 0.55
  let angle = -Math.PI / 2
  const arcs: JSX.Element[] = []
  segments.forEach((seg, idx) => {
    const frac = seg.value / total
    const a = frac * Math.PI * 2
    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    const x2 = cx + r * Math.cos(angle + a)
    const y2 = cy + r * Math.sin(angle + a)
    const large = a > Math.PI ? 1 : 0
    const d = [
      `M ${cx + inner * Math.cos(angle)} ${cy + inner * Math.sin(angle)}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
      `L ${cx + inner * Math.cos(angle + a)} ${cy + inner * Math.sin(angle + a)}`,
      `A ${inner} ${inner} 0 ${large} 0 ${cx + inner * Math.cos(angle)} ${cy + inner * Math.sin(angle)}`,
      'Z',
    ].join(' ')
    arcs.push(
      <path
        key={idx}
        d={d}
        fill={seg.color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
        aria-hidden
      />,
    )
    angle += a
  })

  const pct = (v: number) => `${Math.round((v / total) * 100)}%`

  return (
    <figure className="mx-auto">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
        role="img"
        aria-label={ariaLabel}
      >
        {arcs}
        <circle cx={cx} cy={cy} r={inner * 0.92} fill="#0a0f1e" opacity={0.92} aria-hidden />
      </svg>
      <figcaption className="sr-only">
        <ul>
          {segments.map((seg, i) => (
            <li key={i}>
              {seg.label ?? `Segment ${i + 1}`}: {pct(seg.value)}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}
