export function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-sb-bg text-white">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
