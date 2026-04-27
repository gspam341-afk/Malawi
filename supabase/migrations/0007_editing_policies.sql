-- Enable editing of join tables + materials tables for teachers/admins.
-- Teachers are restricted to their own resources; admins can edit all.

-- resource_subjects
create policy "teacher_admin_manage_resource_subjects" on public.resource_subjects
for all
to authenticated
using (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = resource_subjects.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
)
with check (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = resource_subjects.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
);

-- resource_grade_levels
create policy "teacher_admin_manage_resource_grade_levels" on public.resource_grade_levels
for all
to authenticated
using (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = resource_grade_levels.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
)
with check (
  exists (
    select 1
    from public.resources r
    join public.profiles p on p.id = auth.uid()
    where r.id = resource_grade_levels.resource_id
      and p.status = 'active'
      and (
        p.role = 'admin'
        or (p.role = 'teacher' and r.created_by = auth.uid())
      )
  )
);

-- required_materials
create policy "teacher_admin_manage_required_materials" on public.required_materials
for all
to authenticated
using (
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
)
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

-- printable_materials
create policy "teacher_admin_manage_printable_materials" on public.printable_materials
for all
to authenticated
using (
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
)
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
