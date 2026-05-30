import { type NextRequest, NextResponse } from 'next/server'

/** Block /preview/moderation unless explicitly enabled server-side. */
export function moderationUiGate(request: NextRequest): NextResponse | null {
  if (process.env.ENABLE_MODERATION_UI !== '1') {
    const url = request.nextUrl.clone()
    url.pathname = url.pathname.replace(/\/moderation\/?$/, '') || '/preview'
    return NextResponse.redirect(url)
  }
  return null
}
