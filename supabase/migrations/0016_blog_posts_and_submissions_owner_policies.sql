-- Role-scoped access for blog_posts and submissions.
-- Admin policies are handled via public.is_admin() in previous migrations.

-- Blog posts: authors can read/insert/update their own posts.
drop policy if exists "author_select_own_blog_posts" on public.blog_posts;
drop policy if exists "author_insert_own_blog_posts" on public.blog_posts;
drop policy if exists "author_update_own_blog_posts" on public.blog_posts;

create policy "author_select_own_blog_posts" on public.blog_posts
for select
to authenticated
using (author_id = auth.uid());

create policy "author_insert_own_blog_posts" on public.blog_posts
for insert
to authenticated
with check (author_id = auth.uid());

create policy "author_update_own_blog_posts" on public.blog_posts
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- Submissions: creators can read/insert their own submissions.
drop policy if exists "creator_select_own_submissions" on public.submissions;
drop policy if exists "creator_insert_own_submissions" on public.submissions;
drop policy if exists "creator_update_own_submissions" on public.submissions;

create policy "creator_select_own_submissions" on public.submissions
for select
to authenticated
using (submitted_by = auth.uid());

create policy "creator_insert_own_submissions" on public.submissions
for insert
to authenticated
with check (submitted_by = auth.uid());

-- Creator may only update their submission while pending or changes_requested.
create policy "creator_update_own_submissions" on public.submissions
for update
to authenticated
using (submitted_by = auth.uid() and status in ('pending', 'changes_requested'))
with check (submitted_by = auth.uid() and status in ('pending', 'changes_requested'));
