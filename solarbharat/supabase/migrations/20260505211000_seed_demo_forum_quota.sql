-- Demo forum threads + quota rows (plan §6.5, §6.9). Idempotent.

insert into public.forum_topics (slug, title, category, state_id, scheme_tag, body_md)
values
  (
    'pm-kusum-subsidy-disbursement-faq',
    'How long does PM-KUSUM subsidy actually take?',
    'pm-kusum',
    'gujarat',
    'pm-kusum',
    'We were told 60 days but DISCOM says 6+ months. What timeline should we budget for working capital?'
  ),
  (
    'ht-connection-cost-gujarat',
    'HT / grid connection ballpark for 1 MW ground mount',
    'grid',
    'gujarat',
    null,
    'Looking for recent experience on transformer + HT line costs in South Gujarat — order of magnitude only.'
  )
on conflict (slug) do nothing;

insert into public.forum_posts (topic_id, body_md, is_verified_answer)
select t.id,
  'Budget 4–9 months from application milestones for subsidy flow; keep 6 months working capital as conservative default (verify with your nodal agency).',
  true
from public.forum_topics t
where t.slug = 'pm-kusum-subsidy-disbursement-faq'
  and not exists (
    select 1 from public.forum_posts p where p.topic_id = t.id
  );

insert into public.forum_posts (topic_id, body_md, is_verified_answer)
select t.id,
  'Varies by DISCOM and distance — get three quotes after CEIG sanction; many projects see ₹40–90L+ for HT gear depending on voltage and length.',
  false
from public.forum_topics t
where t.slug = 'ht-connection-cost-gujarat'
  and not exists (
    select 1 from public.forum_posts p where p.topic_id = t.id
  );

insert into public.quota_snapshots (
  captured_at,
  state_id,
  district_id,
  status_band,
  mw_remaining,
  source,
  source_detail
)
select now () - interval '1 hour',
  'gujarat',
  'bharuch',
  'limited',
  42,
  'manual',
  'Demo row — replace with scraper + crowdsourced reports.'
where not exists (
  select 1
  from public.quota_snapshots q
  where q.state_id = 'gujarat'
    and q.district_id is not distinct from 'bharuch'
    and date_trunc ('day', q.captured_at)::date = current_date
);

insert into public.quota_snapshots (
  captured_at,
  state_id,
  district_id,
  status_band,
  mw_remaining,
  source,
  source_detail
)
select now () - interval '2 hour',
  'rajasthan',
  null,
  'available',
  null,
  'manual',
  'Demo row'
where not exists (
  select 1
  from public.quota_snapshots q
  where q.state_id = 'rajasthan'
    and q.district_id is null
    and date_trunc ('day', q.captured_at)::date = current_date
);

insert into public.quota_snapshots (
  captured_at,
  state_id,
  district_id,
  status_band,
  mw_remaining,
  source,
  source_detail
)
select now () - interval '30 minute',
  'maharashtra',
  'pune',
  'nearly_full',
  8.5,
  'crowdsourced',
  'Demo row'
where not exists (
  select 1
  from public.quota_snapshots q
  where q.state_id = 'maharashtra'
    and q.district_id is not distinct from 'pune'
    and date_trunc ('day', q.captured_at)::date = current_date
);
