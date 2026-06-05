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
      <ol className="flex gap-1">
        {Array.from({ length: steps }, (_, i) => {
          const step = i + 1
          const active = step === current
          const done = step < current
          return (
            <li key={step} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? 'bg-sb-gold text-sb-bg'
                    : done
                      ? 'bg-sb-green/20 text-sb-green'
                      : 'bg-white/10 text-white/70'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : step}
              </span>
              <span
                className={`hidden text-center text-[10px] font-bold uppercase tracking-wide sm:block ${
                  active ? 'text-sb-gold' : 'text-white/65'
                }`}
              >
                {labels[i] ?? `Step ${step}`}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
