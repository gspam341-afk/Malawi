-- Service role is used server-side for admin invite flow.
-- It must have privileges on profiles for upsert.

grant usage on schema public to service_role;

grant select, insert, update, delete on table public.profiles to service_role;
