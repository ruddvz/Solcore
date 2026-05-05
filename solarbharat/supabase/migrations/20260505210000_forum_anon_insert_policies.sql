-- Allow anonymous forum posts for Phase 2 MVP (plan §6.9). Moderate via Supabase dashboard / future auth.

create policy forum_topics_insert_anon on public.forum_topics for insert with check (true);

create policy forum_posts_insert_anon on public.forum_posts for insert with check (true);
