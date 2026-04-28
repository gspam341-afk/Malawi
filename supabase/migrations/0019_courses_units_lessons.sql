-- Learning hub: courses → units → lessons → linked resources (MVP).
-- TODO: student progress, streaks, quizzes, certificates — not in this schema.

-- =====================
-- Tables
-- =====================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  subject_id uuid not null references public.subjects(id),
  grade_level_id uuid not null references public.grade_levels(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  visibility text not null default 'public' check (visibility in ('public', 'logged_in_only', 'private')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.course_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.course_units(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  slug text,
  description text,
  content text,
  lesson_type text not null default 'article' check (lesson_type in ('article', 'video', 'activity', 'worksheet', 'mixed')),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint lessons_course_slug_unique unique (course_id, slug)
);

create table if not exists public.lesson_resources (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (lesson_id, resource_id)
);

create index if not exists courses_subject_id_idx on public.courses (subject_id);
create index if not exists courses_grade_level_id_idx on public.courses (grade_level_id);
create index if not exists courses_status_visibility_idx on public.courses (status, visibility);
create index if not exists course_units_course_id_sort_idx on public.course_units (course_id, sort_order);
create index if not exists lessons_unit_id_sort_idx on public.lessons (unit_id, sort_order);
create index if not exists lessons_course_id_sort_idx on public.lessons (course_id, sort_order);
create index if not exists lesson_resources_resource_id_idx on public.lesson_resources (resource_id);

-- Keep lessons.course_id in sync with unit (denormalized for RLS + URL uniqueness).
create or replace function public.lessons_set_course_id_from_unit()
returns trigger
language plpgsql
as $$
declare
  cid uuid;
begin
  select cu.course_id into cid from public.course_units cu where cu.id = new.unit_id;
  if cid is null then
    raise exception 'Invalid unit_id';
  end if;
  new.course_id := cid;
  return new;
end;
$$;

drop trigger if exists lessons_set_course_id_from_unit on public.lessons;
create trigger lessons_set_course_id_from_unit
before insert or update of unit_id on public.lessons
for each row execute function public.lessons_set_course_id_from_unit();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists set_course_units_updated_at on public.course_units;
create trigger set_course_units_updated_at
before update on public.course_units
for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

-- =====================
-- RLS
-- =====================

alter table public.courses enable row level security;
alter table public.course_units enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;

-- ---- courses: public read published + public visibility (anon)
create policy "public_read_published_public_courses" on public.courses
for select
to anon
using (status = 'published' and visibility = 'public');

-- Authenticated: published courses visible to public or logged_in_only
create policy "auth_read_published_courses" on public.courses
for select
to authenticated
using (
  status = 'published'
  and visibility in ('public', 'logged_in_only')
);

-- Teachers read own drafts; admins read all (admin_manage also grants select)
create policy "teacher_read_own_courses" on public.courses
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role = 'teacher'
      and public.courses.created_by = auth.uid()
  )
);

create policy "admin_manage_courses" on public.courses
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_insert_courses" on public.courses
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('teacher', 'admin')
  )
  and created_by = auth.uid()
);

create policy "teacher_update_delete_own_courses" on public.courses
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role = 'teacher'
      and public.courses.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role = 'teacher'
      and public.courses.created_by = auth.uid()
  )
);

create policy "teacher_delete_own_courses" on public.courses
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role = 'teacher'
      and public.courses.created_by = auth.uid()
  )
);

-- ---- course_units: public read when parent course is published public
create policy "public_read_units_public_course" on public.course_units
for select
to anon
using (
  exists (
    select 1 from public.courses c
    where c.id = course_units.course_id
      and c.status = 'published'
      and c.visibility = 'public'
  )
);

create policy "auth_read_units_published_course" on public.course_units
for select
to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = course_units.course_id
      and c.status = 'published'
      and c.visibility in ('public', 'logged_in_only')
  )
);

create policy "teacher_read_units_own_course" on public.course_units
for select
to authenticated
using (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = course_units.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
);

create policy "admin_manage_course_units" on public.course_units
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_manage_units_own_course" on public.course_units
for all
to authenticated
using (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = course_units.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = course_units.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
);

-- ---- lessons
create policy "public_read_published_lessons_public_course" on public.lessons
for select
to anon
using (
  status = 'published'
  and exists (
    select 1 from public.courses c
    where c.id = lessons.course_id
      and c.status = 'published'
      and c.visibility = 'public'
  )
);

create policy "auth_read_published_lessons" on public.lessons
for select
to authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.courses c
    where c.id = lessons.course_id
      and c.status = 'published'
      and c.visibility in ('public', 'logged_in_only')
  )
);

create policy "teacher_read_lessons_own_course" on public.lessons
for select
to authenticated
using (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = lessons.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
);

create policy "admin_manage_lessons" on public.lessons
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_manage_lessons_own_course" on public.lessons
for all
to authenticated
using (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = lessons.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.courses c
    join public.profiles p on p.id = auth.uid()
    where c.id = lessons.course_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
);

-- ---- lesson_resources: public only when lesson + course + resource are appropriately public
create policy "public_read_lesson_resources_public_chain" on public.lesson_resources
for select
to anon
using (
  exists (
    select 1
    from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.resources r on r.id = lesson_resources.resource_id
    where l.id = lesson_resources.lesson_id
      and l.status = 'published'
      and c.status = 'published'
      and c.visibility = 'public'
      and r.status = 'published'
      and r.visibility = 'public'
  )
);

create policy "auth_read_lesson_resources_published_chain" on public.lesson_resources
for select
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.resources r on r.id = lesson_resources.resource_id
    where l.id = lesson_resources.lesson_id
      and l.status = 'published'
      and c.status = 'published'
      and c.visibility in ('public', 'logged_in_only')
      and r.status = 'published'
      and r.visibility in ('public', 'logged_in_only', 'teacher_only')
  )
);

create policy "teacher_read_lesson_resources_own_course" on public.lesson_resources
for select
to authenticated
using (
  exists (
    select 1 from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.profiles p on p.id = auth.uid()
    where l.id = lesson_resources.lesson_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
  )
);

create policy "admin_manage_lesson_resources" on public.lesson_resources
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_manage_lesson_resources_own_course" on public.lesson_resources
for all
to authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.resources r on r.id = lesson_resources.resource_id
    join public.profiles p on p.id = auth.uid()
    where l.id = lesson_resources.lesson_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
      and r.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.resources r on r.id = lesson_resources.resource_id
    join public.profiles p on p.id = auth.uid()
    where l.id = lesson_resources.lesson_id
      and p.status = 'active'
      and p.role = 'teacher'
      and c.created_by = auth.uid()
      and r.created_by = auth.uid()
  )
);

-- =====================
-- Grants
-- =====================

grant select on table public.courses, public.course_units, public.lessons, public.lesson_resources to anon, authenticated;

grant insert, update, delete on table public.courses, public.course_units, public.lessons, public.lesson_resources to authenticated;

grant select on table public.courses, public.course_units, public.lessons, public.lesson_resources to service_role;
