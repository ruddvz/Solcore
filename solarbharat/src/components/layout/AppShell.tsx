'use client'

import { usePathname } from 'next/navigation'
import { stripBasePath } from '@/lib/publicBasePath'
import { Layout } from '@/components/layout/Layout'
import { HtmlLangSync } from '@/components/layout/HtmlLangSync'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const path = stripBasePath(pathname ?? '/')
  const isOffline = path === '/offline' || path.endsWith('/offline')

  return (
    <>
      <HtmlLangSync />
      {isOffline ? children : <Layout>{children}</Layout>}
    </>
  )
}
