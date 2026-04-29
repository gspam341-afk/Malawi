-- Security/data-quality hardening pass:
-- - Fix profile sync defaults and ensure only one auth trigger is active
-- - Tighten storage object ownership rules for blog-images
-- - Add bucket limits for printable-materials
-- - Add missing integrity checks and supporting indexes

-- =====================
-- Profiles sync hardening
-- =====================

create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  incoming_role text;
begin
  incoming_role := coalesce(new.raw_user_meta_data ->> 'role', 'student_optional');

  -- Only allow known roles from metadata; fallback to least-privileged role.
  if incoming_role not in ('admin', 'teacher', 'alumni', 'donor', 'student_optional') then
    incoming_role := 'student_optional';
  end if;

  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'name', ''), ''),
    incoming_role,
    'active'
  )
  on conflict (id)
  do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    -- Preserve existing role if already set; never silently elevate defaults.
    role = coalesce(public.profiles.role, excluded.role),
    status = coalesce(public.profiles.status, 'active');

  return new;
end;
$$;

-- Ensure only one trigger remains active on auth.users.
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_created_profile_sync on auth.users;

create trigger on_auth_user_created_profile_sync
after insert on auth.users
for each row
execute function public.handle_auth_user_profile_sync();

-- =====================
-- Storage hardening
-- =====================

-- Add ownership checks for blog-images updates/deletes and keep role checks.
drop policy if exists "blog_roles_update_blog_images" on storage.objects;
create policy "blog_roles_update_blog_images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-images'
  and owner = auth.uid()
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
  and owner = auth.uid()
  and coalesce(split_part(name, '/', 1), '') = 'blog-posts'
);

drop policy if exists "blog_roles_delete_blog_images" on storage.objects;
create policy "blog_roles_delete_blog_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-images'
  and owner = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);

-- Also enforce owner on blog image inserts.
drop policy if exists "blog_roles_insert_blog_images" on storage.objects;
create policy "blog_roles_insert_blog_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and owner = auth.uid()
  and coalesce(split_part(name, '/', 1), '') = 'blog-posts'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);

-- Add upload limits for printable-materials bucket (defense-in-depth).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'printable-materials',
  'printable-materials',
  false,
  10485760,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =====================
-- Data integrity checks
-- =====================

alter table public.resources
  add constraint resources_group_sizes_valid
  check (
    (group_size_min is null and group_size_max is null)
    or (
      group_size_min is not null
      and group_size_max is not null
      and group_size_min >= 1
      and group_size_max >= group_size_min
    )
  ) not valid;

alter table public.resources
  validate constraint resources_group_sizes_valid;

alter table public.printable_materials
  add constraint printable_materials_pages_count_positive
  check (pages_count is null or pages_count >= 1) not valid;

alter table public.printable_materials
  validate constraint printable_materials_pages_count_positive;

alter table public.required_materials
  add constraint required_materials_quantity_positive
  check (quantity is null or quantity >= 1) not valid;

alter table public.required_materials
  validate constraint required_materials_quantity_positive;

-- =====================
-- Performance indexes
-- =====================

create index if not exists resource_subjects_subject_id_idx
  on public.resource_subjects (subject_id);

create index if not exists resource_grade_levels_grade_level_id_idx
  on public.resource_grade_levels (grade_level_id);

create index if not exists blog_post_subjects_subject_id_idx
  on public.blog_post_subjects (subject_id);

create index if not exists submissions_submitted_by_status_idx
  on public.submissions (submitted_by, status);

create index if not exists lesson_resources_lesson_id_idx
  on public.lesson_resources (lesson_id);
