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
      {overline ? <p className="sb-overline text-sb-goldDark">{overline}</p> : null}
      <h1 className="sb-title-1">{title}</h1>
      {subtitle ? <p className="sb-body max-w-2xl text-pretty">{subtitle}</p> : null}
      {children}
    </header>
  )
}
