import { type NextRequest, NextResponse } from 'next/server'
import { moderationUiGate } from '@/lib/moderationGate'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path.includes('/preview/moderation')) {
    const blocked = moderationUiGate(request)
    if (blocked) return blocked
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
