import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseServiceRoleClient } from '@/lib/supabase/service'
import type { Tables } from '@/types/db'

async function loadAuthorNamesByIds(ids: string[]): Promise<Map<string, string | null>> {
  if (!ids.length) return new Map()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return new Map()
  try {
    const service = createSupabaseServiceRoleClient()
    const { data: profs } = await service.from('profiles').select('id,name').in('id', ids)
    return new Map((profs ?? []).map((p) => [p.id, p.name]))
  } catch {
    return new Map()
  }
}

export type BlogSubjectTag = { id: string; name: string }

export type PublishedBlogListItem = Pick<
  Tables['blog_posts']['Row'],
  'id' | 'title' | 'slug' | 'excerpt' | 'cover_image_url' | 'published_at' | 'created_at' | 'author_id'
> & {
  subjects: BlogSubjectTag[]
  /** Present when loaded with author join or follow-up profile fetch. */
  author_name?: string | null
}

export type PublishedBlogDetail = PublishedBlogListItem &
  Pick<Tables['blog_posts']['Row'], 'content'> & {
    author_name: string | null
  }

function mapSubjectRows(
  rows: { subject: { id: string; name: string } | null }[] | null | undefined,
): BlogSubjectTag[] {
  const list = (rows ?? [])
    .map((r) => r.subject)
    .filter((s): s is { id: string; name: string } => Boolean(s))
  return list.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getPublishedBlogPosts(): Promise<PublishedBlogListItem[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      created_at,
      author_id,
      blog_post_subjects (
        subject:subjects (id, name)
      )
    `,
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw error

  type Row = {
    id: string
    title: string
    slug: string | null
    excerpt: string | null
    cover_image_url: string | null
    published_at: string | null
    created_at: string
    author_id: string | null
    blog_post_subjects: { subject: { id: string; name: string } | null }[] | null
  }

  const rows = (data ?? []) as unknown as Row[]
  const authorIds = [...new Set(rows.map((r) => r.author_id).filter(Boolean))] as string[]
  const authorNames = await loadAuthorNamesByIds(authorIds)

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    cover_image_url: row.cover_image_url,
    published_at: row.published_at,
    created_at: row.created_at,
    author_id: row.author_id,
    author_name: row.author_id ? authorNames.get(row.author_id) ?? null : null,
    subjects: mapSubjectRows(row.blog_post_subjects),
  }))
}

export async function getPublishedBlogPostBySlugOrId(slugOrId: string): Promise<PublishedBlogDetail | null> {
  const supabase = await createSupabaseServerClient()

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId)

  let query = supabase
    .from('blog_posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      published_at,
      created_at,
      author_id,
      blog_post_subjects (
        subject:subjects (id, name)
      )
    `,
    )
    .eq('status', 'published')

  query = isUuid ? query.eq('id', slugOrId) : query.eq('slug', slugOrId)

  const { data: post, error } = await query.maybeSingle()

  if (error) throw error
  if (!post) return null

  const authorMap = post.author_id ? await loadAuthorNamesByIds([post.author_id]) : new Map<string, string | null>()
  const author_name = post.author_id ? authorMap.get(post.author_id) ?? null : null

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: post.cover_image_url,
    published_at: post.published_at,
    created_at: post.created_at,
    author_id: post.author_id,
    author_name,
    subjects: mapSubjectRows(
      post.blog_post_subjects as unknown as { subject: { id: string; name: string } | null }[] | null,
    ),
  }
}

/** Newest published post for the homepage (no body content). */
export async function getLatestPublishedBlogPostForHome(): Promise<PublishedBlogListItem | null> {
  const supabase = await createSupabaseServerClient()

  const { data: row, error } = await supabase
    .from('blog_posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      published_at,
      created_at,
      author_id,
      blog_post_subjects (
        subject:subjects (id, name)
      )
    `,
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!row) return null

  type Row = {
    id: string
    title: string
    slug: string | null
    excerpt: string | null
    cover_image_url: string | null
    published_at: string | null
    created_at: string
    author_id: string | null
    blog_post_subjects: { subject: { id: string; name: string } | null }[] | null
  }

  const r = row as unknown as Row
  const authorMap = r.author_id ? await loadAuthorNamesByIds([r.author_id]) : new Map<string, string | null>()
  const author_name = r.author_id ? authorMap.get(r.author_id) ?? null : null

  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    cover_image_url: r.cover_image_url,
    published_at: r.published_at,
    created_at: r.created_at,
    author_id: r.author_id,
    author_name,
    subjects: mapSubjectRows(r.blog_post_subjects),
  }
}
