-- Ensure service_role can read required tables for server-side operations (signed URLs, ownership checks).

grant usage on schema public to service_role;

grant select on table public.printable_materials to service_role;
grant select on table public.resources to service_role;
grant select on table public.profiles to service_role;
