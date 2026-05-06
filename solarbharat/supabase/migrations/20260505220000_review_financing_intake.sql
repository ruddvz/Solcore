-- Intake tables for reviews & financing leads (plan §6.4, §7.2) — anon insert for MVP lead capture

create table if not exists public.review_intake (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  email text,
  contractor_reference text,
  rating_overall smallint check (
    rating_overall >= 1
    and rating_overall <= 5
  ),
  body text,
  cod_hint text
);

create table if not exists public.financing_leads (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now (),
  email text not null,
  phone text,
  state_id text,
  district_id text,
  capacity_kwp numeric,
  notes text
);

alter table public.review_intake enable row level security;
alter table public.financing_leads enable row level security;

create policy review_intake_insert_anon on public.review_intake for insert with check (true);

create policy financing_leads_insert_anon on public.financing_leads for insert with check (true);
