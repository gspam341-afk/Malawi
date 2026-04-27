-- Automatically keep public.profiles in sync with auth.users.
-- This prevents cases where an auth user exists but no profile row was created.

create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'name', ''), ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'teacher'),
    'active'
  )
  on conflict (id)
  do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    role = coalesce(excluded.role, public.profiles.role),
    status = coalesce(public.profiles.status, 'active');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile_sync on auth.users;
create trigger on_auth_user_created_profile_sync
after insert on auth.users
for each row
execute function public.handle_auth_user_profile_sync();
