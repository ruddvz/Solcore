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
      <label htmlFor={id} className="text-[13px] font-semibold text-sb-ink-soft">
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
        <p id={hintId} className="sb-caption">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-sb-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'min-h-[52px] w-full rounded-sb-md border border-sb-line-strong bg-white px-3 py-2.5 text-base text-sb-ink outline-none focus-visible:ring-2 focus-visible:ring-sb-gold'

export function FormStatus({
  message,
  ok,
}: {
  message: string
  ok: boolean
}) {
  return (
    <p
      className={`text-sm font-medium ${ok ? 'text-sb-green' : 'text-sb-red'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
  )
}
