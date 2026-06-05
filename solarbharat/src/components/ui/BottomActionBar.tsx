'use client'

import { Button, ButtonLink } from '@/components/ui/Button'

export function BottomActionBar({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`fixed left-0 right-0 z-40 border-t border-[var(--sb-line)] bg-[rgba(255,253,247,0.92)] backdrop-blur-md lg:hidden ${className}`}
      style={{
        bottom: 'calc(82px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto flex max-w-page gap-2 px-3 py-3">{children}</div>
    </div>
  )
}

export function BottomActionBarSpacer() {
  return (
    <div className="h-[calc(154px+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
  )
}

export function BottomNavButton({
  label,
  onClick,
  disabled,
  variant = 'secondary',
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className="min-h-[48px] flex-1"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}

export function BottomNavLink({
  href,
  label,
  variant = 'primary',
  className = '',
}: {
  href: string
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}) {
  return (
    <ButtonLink href={href} variant={variant} className={`min-h-[48px] flex-1 ${className}`}>
      {label}
    </ButtonLink>
  )
}
