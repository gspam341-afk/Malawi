drop policy if exists "public_read_printable_material_objects" on storage.objects;

drop policy if exists "auth_read_printable_material_objects" on storage.objects;
create policy "auth_read_printable_material_objects"
on storage.objects
for select
to authenticated
using (bucket_id = 'printable-materials');

update storage.buckets set public = false where id = 'printable-materials';
