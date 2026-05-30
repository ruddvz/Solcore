export function PageHeader({
  overline,
  title,
  subtitle,
  children,
}: {
  overline?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <header className="space-y-2">
      {overline ? <p className="sb-overline text-white/50">{overline}</p> : null}
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      {subtitle ? <p className="sb-body max-w-2xl text-pretty text-white/60">{subtitle}</p> : null}
      {children}
    </header>
  )
}
