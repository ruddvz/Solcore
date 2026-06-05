import Link from 'next/link'
import { withBasePath } from '@/lib/publicBasePath'

const base =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sb-md px-5 text-base font-bold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sb-bg disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: `${base} bg-sb-gold text-sb-ink shadow-sb-sm hover:bg-sb-goldDark`,
  secondary: `${base} border border-sb-line bg-sb-card-strong text-sb-ink hover:border-sb-lineStrong`,
  ghost: `${base} text-sb-goldDark hover:bg-sb-goldSoft`,
  success: `${base} bg-sb-green text-sb-inverse shadow-sb-sm hover:bg-sb-greenDark`,
  warning: `${base} bg-sb-orangeSoft text-sb-ink border border-sb-orange/30`,
  danger: `${base} bg-sb-redSoft text-sb-red border border-sb-red/25`,
} as const

type Variant = keyof typeof variants

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  busy,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  busy?: boolean
}) {
  return (
    <button
      type={type}
      className={`${variants[variant]} ${className}`}
      aria-busy={busy || undefined}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={withBasePath(href)} className={`${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
