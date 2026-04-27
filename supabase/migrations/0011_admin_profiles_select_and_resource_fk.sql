-- Admin should be able to read all profiles.
create policy "admin_select_all_profiles" on public.profiles
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'
  )
);

-- Allow deleting profiles without breaking resources by nulling references.
-- This helps when cleaning up test data while keeping the rest of the database consistent.
alter table public.resources drop constraint if exists resources_created_by_fkey;
alter table public.resources
  add constraint resources_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.resources drop constraint if exists resources_approved_by_fkey;
alter table public.resources
  add constraint resources_approved_by_fkey
  foreign key (approved_by) references public.profiles(id) on delete set null;
