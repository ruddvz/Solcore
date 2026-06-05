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
      <span className="text-[13px] font-semibold text-sb-ink-soft">{label}</span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[52px] w-full appearance-none rounded-sb-md border border-sb-line-strong bg-white px-3 py-2.5 pr-10 text-base text-sb-ink outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sb-muted"
          aria-hidden
        >
          ▾
        </span>
      </div>
    </label>
  )
}
