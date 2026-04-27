-- Fix: avoid infinite recursion in profiles RLS policies by removing policies that query profiles within profiles policies.

-- Drop the recursive admin policy if it exists.
drop policy if exists "admin_read_all_profiles" on public.profiles;

-- Optional: allow admins (based on JWT user_metadata.role) to read all profiles.
-- This avoids querying public.profiles inside the policy.
create policy "admin_read_all_profiles"
on public.profiles
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
