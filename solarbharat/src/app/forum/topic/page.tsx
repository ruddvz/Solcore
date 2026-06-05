import { Suspense } from 'react'
import { ForumTopicPage } from '@/sections/ForumTopicPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-white/65">Loading…</div>}>
      <ForumTopicPage />
    </Suspense>
  )
}
