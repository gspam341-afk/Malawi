-- Drop permissive role_insert_* policies: with default PERMISSIVE RLS they OR with
-- owner policies and allowed spoofed author_id / submitted_by on insert.
-- Blog: admin_manage_blog_posts + author_insert_own_blog_posts (+ public read published).
-- Submissions: creator_insert_own_submissions (submitted_by = auth.uid()); admins
-- insert their own rows the same way.

drop policy if exists "role_insert_blog_posts" on public.blog_posts;
drop policy if exists "role_insert_submissions" on public.submissions;
