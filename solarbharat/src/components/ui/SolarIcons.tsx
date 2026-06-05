const iconClass = 'h-6 w-6 shrink-0'
const s = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function IconHome({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" {...s} />
    </svg>
  )
}

export function IconDistrict({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2C8 6 4 8 4 13a8 8 0 1016 0c0-5-4-7-8-11z" {...s} />
      <circle cx="12" cy="13" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function IconCalculator({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="2" {...s} />
      <path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3" {...s} />
    </svg>
  )
}

export function IconReport({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" {...s} />
      <path d="M14 3v5h5M9 12h6M9 16h6" {...s} />
    </svg>
  )
}

export function IconContractors({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V8l8-4 8 4v12M4 8l8 4m0-4l8 4m-8 4v8m0-8l8-4m-8 12l8-4" {...s} />
    </svg>
  )
}

export function IconMore({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="1.75" fill="currentColor" />
      <circle cx="12" cy="12" r="1.75" fill="currentColor" />
      <circle cx="18" cy="12" r="1.75" fill="currentColor" />
    </svg>
  )
}

export function IconLocation({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" {...s} />
      <circle cx="12" cy="10" r="2.5" {...s} />
    </svg>
  )
}

export function IconSun({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" {...s} />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" {...s} />
    </svg>
  )
}

export function IconMap({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" {...s} />
      <path d="M9 3v15M15 6v15" {...s} />
    </svg>
  )
}

export function IconRupee({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 4h12M6 8h9a4 4 0 010 8H6M6 12h10M6 20V4" {...s} />
    </svg>
  )
}

export function IconChart({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5M4 19h16" {...s} />
      <path d="M8 16V11M12 16V8M16 16v-5" {...s} />
    </svg>
  )
}

export function IconWarning({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l9 16H3L12 3z" {...s} />
      <path d="M12 9v5M12 17h.01" {...s} />
    </svg>
  )
}

export function IconCheck({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12l5 5L19 7" {...s} />
    </svg>
  )
}

export function IconInfo({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 10v6M12 7h.01" {...s} />
    </svg>
  )
}

export function IconDownload({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v12M8 11l4 4 4-4M5 19h14" {...s} />
    </svg>
  )
}

export function IconShare({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 12l8-4v3a4 4 0 010 8v-3l-8-4z" {...s} />
    </svg>
  )
}

export function IconSearch({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" {...s} />
      <path d="M16 16l5 5" {...s} />
    </svg>
  )
}

export function IconFilter({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" {...s} />
    </svg>
  )
}

export function IconBack({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" {...s} />
    </svg>
  )
}

export function IconClose({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 7l10 10M17 7L7 17" {...s} />
    </svg>
  )
}

export function IconLanguage({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" {...s} />
    </svg>
  )
}

export function IconOffline({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12a8 8 0 0114.5-4.5M20 12a8 8 0 01-14.5 4.5" {...s} />
      <path d="M4 4l16 16" {...s} />
    </svg>
  )
}
