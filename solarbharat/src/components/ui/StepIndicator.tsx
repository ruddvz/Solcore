export function StepIndicator({
  steps,
  current,
  labels,
}: {
  steps: number
  current: number
  labels: string[]
}) {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex gap-1.5 overflow-x-auto pb-1">
        {Array.from({ length: steps }, (_, i) => {
          const step = i + 1
          const active = step === current
          const done = step < current
          const label = labels[i] ?? `Step ${step}`
          return (
            <li key={step} className="min-w-0 flex-1">
              <div
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-sb-pill px-2 py-2 text-center transition ${
                  active
                    ? 'bg-sb-goldSoft text-sb-ink shadow-sb-xs'
                    : done
                      ? 'bg-sb-greenMuted text-sb-greenDark'
                      : 'bg-sb-surface-muted text-sb-muted'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">
                  {done ? '✓' : step}
                </span>
                <span className="truncate text-[10px] font-bold uppercase tracking-wide">{label}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
