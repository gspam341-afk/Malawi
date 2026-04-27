-- Fix profiles admin policies to avoid RLS recursion.

drop policy if exists "admin_select_all_profiles" on public.profiles;
drop policy if exists "admin_update_all_profiles" on public.profiles;

-- Admins (based on JWT user_metadata.role) can read/update all profiles.
-- This avoids querying public.profiles inside profiles policies.
create policy "admin_select_all_profiles" on public.profiles
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create policy "admin_update_all_profiles" on public.profiles
for update
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
