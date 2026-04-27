-- Grant base table privileges to Supabase roles (RLS policies still apply).

grant usage on schema public to anon, authenticated;

-- Public browsing
grant select on table
  public.grade_levels,
  public.subjects,
  public.resources,
  public.resource_grade_levels,
  public.resource_subjects,
  public.required_materials,
  public.printable_materials,
  public.blog_posts
to anon, authenticated;

-- Authenticated app actions (teachers/admins controlled by RLS)
grant insert, update, delete on table
  public.resources,
  public.resource_grade_levels,
  public.resource_subjects,
  public.required_materials,
  public.printable_materials,
  public.blog_posts,
  public.submissions
to authenticated;

-- Profiles (self access/admin access is controlled by RLS)
grant select, insert, update on table public.profiles to authenticated;
