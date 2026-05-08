'use client'

import { useCallback, useState } from 'react'

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
      const res = await fetch('/api/admin/forum', {
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
      const res = await fetch('/api/admin/forum', {
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Forum moderation (Phase 2)</h1>
        <p className="mt-2 text-sm text-white/55">
          Uses <code className="text-sb-gold">MODERATION_SECRET</code> and{' '}
          <code className="text-sb-gold">SUPABASE_SERVICE_ROLE_KEY</code> on the server. Never expose the
          service key in the browser — this page only sends the moderation bearer token.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-sb-surface/80 p-4">
        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-white/45">
          Moderation secret
        </label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
          autoComplete="off"
        />
        <button
          type="button"
          disabled={busy || !secret}
          onClick={() => void load()}
          className="mt-3 rounded-xl bg-sb-gold px-4 py-2 text-sm font-extrabold text-sb-bg disabled:opacity-50"
        >
          {busy ? 'Loading…' : 'Load topics'}
        </button>
      </div>

      {error ? <p className="text-sm text-sb-orange">{error}</p> : null}

      {topics && (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-sb-bg/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-bold text-white">{t.title}</div>
                <div className="font-mono text-xs text-white/45">
                  {t.slug} · {t.category}
                  {t.hidden ? ' · hidden' : ''}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void toggle(t.slug, !t.hidden)}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white hover:border-sb-gold/50"
                >
                  {t.hidden ? 'Unhide' : 'Hide'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
