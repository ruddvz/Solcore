import Link from 'next/link'
import { withBasePath } from '@/lib/publicBasePath'

const base =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-base font-extrabold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sb-bg disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: `${base} bg-sb-gold text-sb-bg shadow-lg shadow-sb-gold/20 hover:bg-sb-goldDark`,
  secondary: `${base} border border-white/15 text-white/85 hover:border-white/30 hover:text-white`,
  ghost: `${base} text-sb-gold hover:text-sb-goldDark`,
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
