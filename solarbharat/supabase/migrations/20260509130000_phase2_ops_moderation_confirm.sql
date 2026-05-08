-- Plan0 Phase 2 ops: forum moderation flag + email confirmation tokens

alter table public.forum_topics
  add column if not exists hidden boolean not null default false;

alter table public.email_alert_subscriptions
  add column if not exists confirm_token text;

alter table public.email_alert_subscriptions
  add column if not exists confirm_sent_at timestamptz;

create unique index if not exists idx_email_alert_confirm_token
  on public.email_alert_subscriptions (confirm_token)
  where confirm_token is not null;

-- Public readers only see non-hidden topics (service role bypasses RLS for admin routes)
drop policy if exists forum_topics_select_public on public.forum_topics;

create policy forum_topics_select_public on public.forum_topics for select using (hidden = false);
