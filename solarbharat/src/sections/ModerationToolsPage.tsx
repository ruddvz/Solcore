'use client'

import { useCallback, useState } from 'react'
import { withBasePath } from '@/lib/publicBasePath'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'

type TopicRow = {
  id: string
  slug: string
  title: string
  category: string
  hidden: boolean
  created_at: string
}

export function ModerationToolsPage() {
  const [secret, setSecret] = useState('')
  const [topics, setTopics] = useState<TopicRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(withBasePath('/api/admin/forum'), {
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data = (await res.json()) as { topics?: TopicRow[]; error?: string }
      if (!res.ok) {
        setError(data.error ?? res.statusText)
        setTopics(null)
        return
      }
      setTopics(data.topics ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
      setTopics(null)
    } finally {
      setBusy(false)
    }
  }, [secret])

  async function toggle(slug: string, hidden: boolean) {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(withBasePath('/api/admin/forum'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, hidden }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? res.statusText)
        return
      }
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Forum moderation"
        subtitle="Uses MODERATION_SECRET and SUPABASE_SERVICE_ROLE_KEY on the server. Never expose the service key in the browser — this page only sends the moderation bearer token."
      />

      <Card>
        <FormField
          label="Moderation secret"
          hint="Set ENABLE_MODERATION_UI=1 on the server to reach this page in production."
        >
          {({ id, describedBy }) => (
            <input
              id={id}
              type="password"
              autoComplete="off"
              aria-describedby={describedBy}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className={inputClass}
            />
          )}
        </FormField>
        <Button
          type="button"
          disabled={busy || !secret}
          busy={busy}
          onClick={() => void load()}
          className="mt-4"
        >
          {busy ? 'Loading…' : 'Load topics'}
        </Button>
      </Card>

      {error ? <FormStatus message={error} ok={false} /> : null}

      {topics && (
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li
              key={topic.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-sb-bg/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-bold text-white">{topic.title}</div>
                <div className="font-mono text-xs text-white/45">
                  {topic.slug} · {topic.category}
                  {topic.hidden ? ' · hidden' : ''}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => void toggle(topic.slug, !topic.hidden)}
                className="min-h-0 min-w-0 px-3 py-1.5 text-xs"
              >
                {topic.hidden ? 'Unhide' : 'Hide'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
