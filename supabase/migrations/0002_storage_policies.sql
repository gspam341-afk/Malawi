-- Storage bucket: printable-materials
-- This assumes the bucket exists (create it in the dashboard, or run the insert below if your project permits).
-- insert into storage.buckets (id, name, public) values ('printable-materials', 'printable-materials', true);

-- Enable RLS on storage.objects (usually already enabled)
alter table storage.objects enable row level security;

-- Public can download files in printable-materials bucket
create policy "public_read_printable_material_objects"
on storage.objects
for select
using (bucket_id = 'printable-materials');

-- Only teachers/admins can upload into printable-materials bucket
create policy "teacher_admin_upload_printable_material_objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'printable-materials'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher')
  )
);

-- Only teachers/admins can update/delete objects (MVP: no ownership enforcement)
create policy "teacher_admin_update_printable_material_objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'printable-materials'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher')
  )
)
with check (
  bucket_id = 'printable-materials'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher')
  )
);

create policy "teacher_admin_delete_printable_material_objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'printable-materials'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin', 'teacher')
  )
);
