-- Allow teachers to delete their own resources; admins can delete all.
-- Related rows are removed via ON DELETE CASCADE.

create policy "teacher_admin_delete_resources" on public.resources
for delete
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
);
