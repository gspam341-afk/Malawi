-- Enable required extensions
create extension if not exists pgcrypto;

-- =====================
-- Tables
-- =====================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role text not null check (role in ('admin', 'teacher', 'alumni', 'donor', 'student_optional')),
  status text not null default 'active' check (status in ('active', 'pending', 'inactive', 'banned')),
  profile_image_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  activity_type text,
  result_description text,
  preparation_time text,
  activity_duration text,
  group_size_min integer,
  group_size_max integer,
  difficulty_level text check (difficulty_level in ('easy', 'medium', 'hard')),
  print_required boolean not null default false,
  cutting_required boolean not null default false,
  extra_materials_required boolean not null default false,
  resource_type text not null check (resource_type in ('teaching_material', 'printable_template', 'activity_idea', 'lesson_activity')),
  visibility text not null default 'public' check (visibility in ('public', 'teacher_only', 'logged_in_only', 'private')),
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected', 'archived')),
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  rejection_reason text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published_at timestamp with time zone
);

create table if not exists public.grade_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade_number integer not null,
  description text
);

create table if not exists public.resource_grade_levels (
  resource_id uuid not null references public.resources(id) on delete cascade,
  grade_level_id uuid not null references public.grade_levels(id) on delete cascade,
  primary key (resource_id, grade_level_id)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

create table if not exists public.resource_subjects (
  resource_id uuid not null references public.resources(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  primary key (resource_id, subject_id)
);

create table if not exists public.printable_materials (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null,
  file_type text,
  pages_count integer,
  color_required boolean not null default false,
  double_sided_recommended boolean not null default false,
  paper_size text not null default 'A4',
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.required_materials (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  name text not null,
  quantity integer,
  is_optional boolean not null default false,
  provided_in_template boolean not null default false,
  note text
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected', 'archived')),
  author_id uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  rejection_reason text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published_at timestamp with time zone
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  submission_type text not null check (submission_type in ('blog_post', 'activity_idea', 'teaching_material', 'printable_template')),
  file_url text,
  external_link text,
  submitted_by uuid references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'changes_requested')),
  reviewed_by uuid references public.profiles(id),
  rejection_reason text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- =====================
-- Updated_at trigger
-- =====================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_resources_updated_at on public.resources;
create trigger set_resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_submissions_updated_at on public.submissions;
create trigger set_submissions_updated_at
before update on public.submissions
for each row execute function public.set_updated_at();

-- =====================
-- Seeds
-- =====================

insert into public.grade_levels (name, grade_number)
values
  ('Grade 6', 6),
  ('Grade 7', 7),
  ('Grade 8', 8),
  ('Grade 9', 9),
  ('Grade 10', 10),
  ('Grade 11', 11),
  ('Grade 12', 12),
  ('Grade 13', 13),
  ('Grade 14', 14)
on conflict do nothing;

insert into public.subjects (name)
values
  ('Mathematics'),
  ('Physics'),
  ('Biology'),
  ('Agriculture'),
  ('Chemistry')
on conflict do nothing;

-- =====================
-- RLS
-- =====================

alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.grade_levels enable row level security;
alter table public.resource_grade_levels enable row level security;
alter table public.subjects enable row level security;
alter table public.resource_subjects enable row level security;
alter table public.printable_materials enable row level security;
alter table public.required_materials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.submissions enable row level security;

-- Public can read grade levels and subjects
create policy "public_read_grade_levels" on public.grade_levels
for select using (true);

create policy "public_read_subjects" on public.subjects
for select using (true);

-- Public can read published + public resources
create policy "public_read_published_public_resources" on public.resources
for select
using (status = 'published' and visibility = 'public');

-- Authenticated users can read resources that are public, logged_in_only, or teacher_only (simple MVP logic)
create policy "auth_read_non_private_resources" on public.resources
for select
to authenticated
using (visibility in ('public', 'logged_in_only', 'teacher_only') and status = 'published');

-- Teachers/admins can create resources
create policy "teacher_admin_insert_resources" on public.resources
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher', 'admin')
      and p.status = 'active'
  )
);

-- Teachers can update their own resources; admins can update all
create policy "teacher_admin_update_resources" on public.resources
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and public.resources.created_by = auth.uid())
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and public.resources.created_by = auth.uid())
      )
  )
);

-- Join tables: public read if the resource is public+published
create policy "public_read_resource_grade_levels" on public.resource_grade_levels
for select
using (
  exists (
    select 1
    from public.resources r
    where r.id = resource_grade_levels.resource_id
      and r.status = 'published'
      and r.visibility = 'public'
  )
);

create policy "public_read_resource_subjects" on public.resource_subjects
for select
using (
  exists (
    select 1
    from public.resources r
    where r.id = resource_subjects.resource_id
      and r.status = 'published'
      and r.visibility = 'public'
  )
);

-- Required materials + printable materials: public read if connected to public+published
create policy "public_read_required_materials" on public.required_materials
for select
using (
  exists (
    select 1
    from public.resources r
    where r.id = required_materials.resource_id
      and r.status = 'published'
      and r.visibility = 'public'
  )
);

create policy "public_read_printable_materials" on public.printable_materials
for select
using (
  exists (
    select 1
    from public.resources r
    where r.id = printable_materials.resource_id
      and r.status = 'published'
      and r.visibility = 'public'
  )
);

-- Teachers/admins can manage printable + required materials for resources they own; admins for all
create policy "teacher_admin_insert_required_materials" on public.required_materials
for insert
to authenticated
with check (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = required_materials.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
);

create policy "teacher_admin_insert_printable_materials" on public.printable_materials
for insert
to authenticated
with check (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = printable_materials.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
);

-- Profiles: users can read/update own profile; admins can read all
create policy "user_read_own_profile" on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "user_update_own_profile" on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admin_read_all_profiles" on public.profiles
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'
  )
);

-- Blog posts: public can read published; auth can create (teacher/alumni/donor/admin) MVP
create policy "public_read_published_blog_posts" on public.blog_posts
for select
using (status = 'published');

create policy "role_insert_blog_posts" on public.blog_posts
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);

-- Submissions: authenticated (teacher/alumni/donor/admin) can insert their own
create policy "role_insert_submissions" on public.submissions
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher', 'alumni', 'donor')
  )
);

-- =====================
-- Storage
-- =====================
-- Create bucket in Supabase dashboard or via SQL if supported in your project:
-- insert into storage.buckets (id, name, public) values ('printable-materials', 'printable-materials', true);
--
-- RLS policies on storage.objects are usually added in a separate migration in Supabase.
