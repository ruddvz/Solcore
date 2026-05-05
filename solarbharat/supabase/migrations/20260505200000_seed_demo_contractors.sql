-- Demo verified contractors for directory UI (plan §6.3). Safe to re-run: skips existing slugs.
insert into public.contractors (
  slug,
  company_name,
  state_id,
  district_ids,
  technology_tags,
  contact_email,
  contact_phone,
  profile_md,
  verified
)
values
  (
    'waaree-services-west',
    'Waaree Energies — western India projects',
    'gujarat',
    ARRAY[]::text[],
    array['topcon', 'bifacial', 'pm-kusum'],
    null,
    null,
    'Illustrative listing for demo only (replace via dashboard). National ALMM partner — typical GW-scale EPC presence in Gujarat.',
    true
  ),
  (
    'rajasthan-solar-epc-demo',
    'Rajasthan Solar EPC (demo)',
    'rajasthan',
    ARRAY[]::text[],
    array['perc', 'ground-mount'],
    null,
    null,
    'Demo placeholder — verify empaneled contractors against your state nodal agency before hiring.',
    true
  ),
  (
    'maharashtra-agri-solar-demo',
    'Maharashtra Agri-Solar (demo)',
    'maharashtra',
    ARRAY[]::text[],
    array['pm-kusum', 'ht-connection'],
    null,
    null,
    'Demo placeholder for calculator/report testing.',
    true
  )
on conflict (slug) do nothing;
