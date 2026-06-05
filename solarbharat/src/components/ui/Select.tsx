export function Select({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-[7px]" htmlFor={id}>
      <span className="text-[13px] font-bold text-sb-ink-soft">{label}</span>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[52px] w-full appearance-none rounded-sb-md border border-[var(--sb-line-strong)] bg-[rgba(255,255,255,0.78)] px-4 py-2.5 pr-10 text-base text-sb-ink outline-none transition focus-visible:ring-2 focus-visible:ring-sb-gold disabled:cursor-not-allowed disabled:bg-sb-surface-muted disabled:opacity-70"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sb-muted"
          aria-hidden
        >
          ▾
        </span>
      </div>
      {hint ? <span className="sb-caption">{hint}</span> : null}
    </label>
  )
}
