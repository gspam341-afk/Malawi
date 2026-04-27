'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function normalizeStatus(input: string) {
  const allowed = ['draft', 'pending', 'published', 'rejected', 'archived']
  return allowed.includes(input) ? input : 'draft'
}

export async function createBlogPostAction(formData: FormData) {
  const admin = await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const status = normalizeStatus(String(formData.get('status') ?? 'draft'))

  const payload = {
    title,
    slug: String(formData.get('slug') ?? '').trim() || null,
    excerpt: String(formData.get('excerpt') ?? '').trim() || null,
    content: String(formData.get('content') ?? '').trim() || null,
    cover_image_url: String(formData.get('cover_image_url') ?? '').trim() || null,
    status,
    author_id: admin.id,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from('blog_posts').insert(payload).select('id').single()
  if (error) throw error

  redirect(`/dashboard/blog-posts/${data.id}/edit`)
}

export async function updateBlogPostAction(postId: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const status = normalizeStatus(String(formData.get('status') ?? 'draft'))

  const { data: existing, error: existingError } = await supabase
    .from('blog_posts')
    .select('published_at')
    .eq('id', postId)
    .single()

  if (existingError) throw existingError

  const nextPublishedAt = status === 'published' ? existing.published_at ?? new Date().toISOString() : null

  const payload = {
    title,
    slug: String(formData.get('slug') ?? '').trim() || null,
    excerpt: String(formData.get('excerpt') ?? '').trim() || null,
    content: String(formData.get('content') ?? '').trim() || null,
    cover_image_url: String(formData.get('cover_image_url') ?? '').trim() || null,
    status,
    published_at: nextPublishedAt,
  }

  const { error } = await supabase.from('blog_posts').update(payload).eq('id', postId)
  if (error) throw error

  redirect(`/dashboard/blog-posts/${postId}/edit`)
}
