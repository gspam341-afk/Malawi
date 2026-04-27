-- Blog post ↔ subjects junction + public blog-images storage bucket.

-- =====================
-- blog_post_subjects
-- =====================

create table if not exists public.blog_post_subjects (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  primary key (blog_post_id, subject_id)
);

alter table public.blog_post_subjects enable row level security;

grant select on table public.blog_post_subjects to anon, authenticated;
grant insert, update, delete on table public.blog_post_subjects to authenticated;

-- Anyone can read subject tags for published posts only.
drop policy if exists "public_select_blog_post_subjects_published" on public.blog_post_subjects;
create policy "public_select_blog_post_subjects_published" on public.blog_post_subjects
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_subjects.blog_post_id
      and bp.status = 'published'
  )
);

-- Authors can read subject tags for their own posts (drafts, pending, etc.).
drop policy if exists "author_select_own_blog_post_subjects" on public.blog_post_subjects;
create policy "author_select_own_blog_post_subjects" on public.blog_post_subjects
for select
to authenticated
using (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_subjects.blog_post_id
      and bp.author_id = auth.uid()
  )
);

-- Admins can read all subject tags (via is_admin; avoids recursion).
drop policy if exists "admin_select_blog_post_subjects" on public.blog_post_subjects;
create policy "admin_select_blog_post_subjects" on public.blog_post_subjects
for select
to authenticated
using (public.is_admin());

-- Authors manage subject tags for posts they own.
drop policy if exists "author_manage_own_blog_post_subjects" on public.blog_post_subjects;
create policy "author_manage_own_blog_post_subjects" on public.blog_post_subjects
for all
to authenticated
using (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_subjects.blog_post_id
      and bp.author_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.blog_posts bp
    where bp.id = blog_post_subjects.blog_post_id
      and bp.author_id = auth.uid()
  )
);

-- Admins manage all subject tags.
drop policy if exists "admin_manage_blog_post_subjects" on public.blog_post_subjects;
create policy "admin_manage_blog_post_subjects" on public.blog_post_subjects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =====================
-- Storage: blog-images (public read; uploads restricted by role)
-- =====================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_blog_images" on storage.objects;
create policy "public_read_blog_images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-images');

drop policy if exists "blog_roles_insert_blog_images" on storage.objects;
create policy "blog_roles_insert_blog_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and coalesce(split_part(name, '/', 1), '') = 'blog-posts'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);

drop policy if exists "blog_roles_update_blog_images" on storage.objects;
create policy "blog_roles_update_blog_images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-images'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
)
with check (
  bucket_id = 'blog-images'
  and coalesce(split_part(name, '/', 1), '') = 'blog-posts'
);

drop policy if exists "blog_roles_delete_blog_images" on storage.objects;
create policy "blog_roles_delete_blog_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-images'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);
