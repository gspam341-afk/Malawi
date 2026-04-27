-- Use a SECURITY DEFINER helper to check admin status without RLS recursion.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
  );
$$;

-- profiles: admin can read/update all

drop policy if exists "admin_read_all_profiles" on public.profiles;
drop policy if exists "admin_select_all_profiles" on public.profiles;
drop policy if exists "admin_update_all_profiles" on public.profiles;

create policy "admin_select_all_profiles" on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "admin_update_all_profiles" on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- resources: admin can read all

drop policy if exists "admin_read_all_resources" on public.resources;
create policy "admin_read_all_resources" on public.resources
for select
to authenticated
using (public.is_admin());

-- subjects

drop policy if exists "admin_manage_subjects" on public.subjects;
create policy "admin_manage_subjects" on public.subjects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- grade_levels

drop policy if exists "admin_manage_grade_levels" on public.grade_levels;
create policy "admin_manage_grade_levels" on public.grade_levels
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- blog_posts

drop policy if exists "admin_manage_blog_posts" on public.blog_posts;
create policy "admin_manage_blog_posts" on public.blog_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- submissions

drop policy if exists "admin_read_submissions" on public.submissions;
drop policy if exists "admin_update_submissions" on public.submissions;

create policy "admin_read_submissions" on public.submissions
for select
to authenticated
using (public.is_admin());

create policy "admin_update_submissions" on public.submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
