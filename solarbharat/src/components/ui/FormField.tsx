'use client'

import { useId } from 'react'

type FormFieldProps = {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
        {label}
        {required ? (
          <span className="text-sb-orange" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children({ id, describedBy })}
      {hint ? (
        <p id={hintId} className="text-xs text-white/65">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-sb-orange" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'min-h-[44px] w-full rounded-xl border border-white/15 bg-sb-bg px-3 py-2.5 text-base text-white outline-none ring-sb-gold/40 focus-visible:ring-2'

export function FormStatus({
  message,
  ok,
}: {
  message: string
  ok: boolean
}) {
  return (
    <p
      className={`text-sm ${ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
  )
}
