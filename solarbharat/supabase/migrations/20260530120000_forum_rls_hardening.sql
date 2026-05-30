-- Harden forum RLS: no hidden topics or verified answers on anon insert; hide posts under hidden topics.

drop policy if exists forum_topics_insert_anon on public.forum_topics;
create policy forum_topics_insert_anon on public.forum_topics
  for insert
  with check (coalesce(hidden, false) = false);

drop policy if exists forum_posts_insert_anon on public.forum_posts;
create policy forum_posts_insert_anon on public.forum_posts
  for insert
  with check (coalesce(is_verified_answer, false) = false);

drop policy if exists forum_posts_select_public on public.forum_posts;
create policy forum_posts_select_public on public.forum_posts
  for select
  using (
    exists (
      select 1
      from public.forum_topics t
      where t.id = topic_id
        and coalesce(t.hidden, false) = false
    )
  );
