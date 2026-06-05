/** Lightweight loading placeholders — respect reduced motion via globals.css */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`sb-shimmer rounded-sb-lg ${className}`} aria-hidden />
  )
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-sb-lg border border-[var(--sb-line)] bg-sb-surface p-4"
      role="status"
      aria-label="Loading"
    >
      <Skeleton className="h-4 w-2/3 max-w-[200px]" />
      <Skeleton className="mt-3 h-3 w-1/3 rounded-[12px]" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-[10px]" />
        <Skeleton className="h-6 w-20 rounded-[10px]" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="status" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
