'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/** Keep document language in sync with i18n (VoiceOver / hyphenation). */
export function HtmlLangSync() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const lng = i18n.language?.split('-')[0] || 'en'
    document.documentElement.lang = lng
    document.documentElement.dir = 'ltr'
  }, [i18n.language])

  return null
}
