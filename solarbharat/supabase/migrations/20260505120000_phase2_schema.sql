-- SolarBharat Phase 2 schema (plan §6.3–§6.10, §10.2)
-- Apply in Supabase: SQL Editor → paste → Run, or use supabase db push when CLI is configured.

-- -----------------------------------------------------------------------------
-- Contractor directory
-- -----------------------------------------------------------------------------

create table if not exists public.contractor_applications (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  company_name text not null,
  contact_name text,
  email text not null,
  phone text,
  state_id text not null,
  district_ids text[] default '{}',
  empanelment_ref text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists idx_contractor_applications_state on public.contractor_applications (state_id);

create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now (),
  slug text not null unique,
  company_name text not null,
  state_id text not null,
  district_ids text[] default '{}',
  technology_tags text[] default '{}',
  contact_email text,
  contact_phone text,
  profile_md text,
  verified boolean not null default false
);

create index if not exists idx_contractors_state on public.contractors (state_id);

-- -----------------------------------------------------------------------------
-- Installation-verified reviews (plan §6.4) — COD refs stored privately for moderation
-- -----------------------------------------------------------------------------

create table if not exists public.installation_reviews (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  contractor_id uuid references public.contractors (id) on delete set null,
  author_user_id uuid references auth.users (id) on delete set null,
  rating_overall smallint not null check (
    rating_overall >= 1
    and rating_overall <= 5
  ),
  timeline_score smallint check (
    timeline_score >= 1
    and timeline_score <= 5
  ),
  quality_score smallint check (
    quality_score >= 1
    and quality_score <= 5
  ),
  support_score smallint check (
    support_score >= 1
    and support_score <= 5
  ),
  body text,
  cod_reference_encrypted text,
  verified boolean not null default false
);

create index if not exists idx_installation_reviews_contractor on public.installation_reviews (contractor_id);

-- -----------------------------------------------------------------------------
-- PM-KUSUM quota tracker (plan §6.5)
-- -----------------------------------------------------------------------------

create table if not exists public.quota_snapshots (
  id uuid primary key default gen_random_uuid (),
  captured_at timestamptz not null default now (),
  state_id text not null,
  district_id text,
  status_band text not null check (
    status_band in ('available', 'limited', 'nearly_full', 'closed', 'unknown')
  ),
  mw_remaining numeric,
  source text not null check (source in ('official_portal', 'crowdsourced', 'manual')),
  source_detail text
);

create unique index if not exists idx_quota_snapshots_day_unique on public.quota_snapshots (
  state_id,
  district_id,
  (date_trunc ('day', captured_at)::date)
);

create index if not exists idx_quota_snapshots_lookup on public.quota_snapshots (state_id, district_id);

-- -----------------------------------------------------------------------------
-- Quote standardisation (plan §6.6)
-- -----------------------------------------------------------------------------

create table if not exists public.standard_quotes (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  contractor_id uuid references public.contractors (id) on delete set null,
  submitted_by uuid references auth.users (id) on delete set null,
  state_id text not null,
  district_id text,
  capacity_kwp numeric,
  cost_per_wp_rs numeric,
  panel_brand text,
  panel_almm boolean,
  inverter_brand text,
  warranty_modules_years smallint,
  warranty_inverter_years smallint,
  cod_months_est smallint,
  penalty_clause boolean,
  raw_payload jsonb
);

-- -----------------------------------------------------------------------------
-- Email alerts (plan §6.10)
-- -----------------------------------------------------------------------------

create table if not exists public.email_alert_subscriptions (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  email text not null,
  alert_type text not null check (
    alert_type in ('quota_open', 'tariff_digest', 'report_reminder')
  ),
  state_id text,
  district_id text,
  confirmed boolean not null default false
);

create unique index if not exists idx_email_alerts_unique on public.email_alert_subscriptions (
  lower(email),
  alert_type,
  coalesce(state_id, ''),
  coalesce(district_id, '')
);

-- -----------------------------------------------------------------------------
-- Public Q&A forum (plan §6.9) — minimal threading
-- -----------------------------------------------------------------------------

create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now (),
  slug text not null unique,
  title text not null,
  category text not null,
  state_id text,
  scheme_tag text,
  author_user_id uuid references auth.users (id) on delete set null,
  body_md text not null
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  topic_id uuid not null references public.forum_topics (id) on delete cascade,
  author_user_id uuid references auth.users (id) on delete set null,
  body_md text not null,
  is_verified_answer boolean not null default false
);

create index if not exists idx_forum_posts_topic on public.forum_posts (topic_id);

-- -----------------------------------------------------------------------------
-- Row Level Security — tighten when auth flows are wired (plan §10.2)
-- -----------------------------------------------------------------------------

alter table public.contractor_applications enable row level security;
alter table public.contractors enable row level security;
alter table public.installation_reviews enable row level security;
alter table public.quota_snapshots enable row level security;
alter table public.standard_quotes enable row level security;
alter table public.email_alert_subscriptions enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;

-- Anonymous applications / alerts (service role bypasses RLS for moderation dashboards)
create policy contractor_applications_insert_anon on public.contractor_applications for insert with check (true);

create policy contractors_select_public on public.contractors for select using (verified = true);

create policy quota_snapshots_select_public on public.quota_snapshots for select using (true);

create policy email_alerts_insert_anon on public.email_alert_subscriptions for insert with check (true);

create policy forum_topics_select_public on public.forum_topics for select using (true);

create policy forum_posts_select_public on public.forum_posts for select using (true);

-- Authenticated users: forum authoring (adjust when profiles exist)
create policy forum_topics_insert_auth on public.forum_topics for insert with check (auth.role () = 'authenticated');

create policy forum_posts_insert_auth on public.forum_posts for insert with check (auth.role () = 'authenticated');

create policy installation_reviews_insert_auth on public.installation_reviews for insert with check (auth.role () = 'authenticated');

create policy installation_reviews_select_own on public.installation_reviews for select using (
  auth.uid () = author_user_id
);

create policy standard_quotes_insert_auth on public.standard_quotes for insert with check (auth.role () = 'authenticated');
