import Link from 'next/link'
import { withBasePath } from '@/lib/publicBasePath'

const base =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sb-md px-[18px] text-[15px] font-bold transition duration-[var(--sb-normal)] ease-[var(--sb-ease)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sb-bg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'

const variants = {
  primary: `${base} sb-btn-primary hover:brightness-[1.02]`,
  secondary: `${base} border border-sb-line bg-sb-card-strong text-sb-ink shadow-sb-xs hover:border-sb-lineStrong`,
  ghost: `${base} text-sb-goldDark hover:bg-sb-goldSoft`,
  success: `${base} bg-sb-green text-sb-inverse shadow-sb-sm hover:bg-sb-greenDark`,
  warning: `${base} bg-sb-orangeSoft text-sb-ink border border-sb-orange/30`,
  danger: `${base} bg-sb-redSoft text-sb-red border border-sb-red/25`,
} as const

const sizes = {
  lg: 'min-h-[54px] rounded-sb-md px-5 text-base',
  md: '',
  sm: 'min-h-[38px] rounded-sb-pill px-3.5 text-[13px]',
  icon: 'h-11 w-11 min-h-0 min-w-0 rounded-sb-md p-0',
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  busy,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  busy?: boolean
}) {
  return (
    <button
      type={type}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
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
  size = 'md',
  className = '',
  children,
}: {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={withBasePath(href)} className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  )
}
