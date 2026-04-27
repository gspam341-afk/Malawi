'use server'

import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/db'

type BlogStatus = Tables['blog_posts']['Row']['status']

function normalizeStatus(input: string, allowed: readonly BlogStatus[]): BlogStatus {
  return (allowed.includes(input as BlogStatus) ? (input as BlogStatus) : allowed[0])
}

function allowedBlogStatusesForRole(role: Tables['profiles']['Row']['role']): readonly BlogStatus[] {
  if (role === 'admin') return ['draft', 'pending', 'published', 'rejected', 'archived']
  if (role === 'teacher') return ['draft', 'pending', 'published', 'archived']
  if (role === 'alumni' || role === 'donor') return ['draft', 'pending']
  return []
}

function canEditBlogPost(profile: Tables['profiles']['Row'], post: Pick<Tables['blog_posts']['Row'], 'author_id' | 'status'>) {
  if (profile.role === 'admin') return true
  if (post.author_id !== profile.id) return false

  if (profile.role === 'teacher') return true
  if (profile.role === 'alumni' || profile.role === 'donor') {
    return post.status === 'draft' || post.status === 'pending' || post.status === 'rejected'
  }

  return false
}

export async function createBlogPostAction(formData: FormData) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    redirect('/dashboard')
  }

  const allowedStatuses = allowedBlogStatusesForRole(profile.role)
  if (!allowedStatuses.length) redirect('/dashboard')

  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const status = normalizeStatus(String(formData.get('status') ?? allowedStatuses[0]), allowedStatuses)

  const payload = {
    title,
    slug: String(formData.get('slug') ?? '').trim() || null,
    excerpt: String(formData.get('excerpt') ?? '').trim() || null,
    content: String(formData.get('content') ?? '').trim() || null,
    cover_image_url: String(formData.get('cover_image_url') ?? '').trim() || null,
    status,
    author_id: profile.id,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from('blog_posts').insert(payload).select('id').single()
  if (error) throw error

  redirect(`/dashboard/blog-posts/${data.id}/edit`)
}

export async function updateBlogPostAction(postId: string, formData: FormData) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    redirect('/dashboard')
  }

  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const allowedStatuses = allowedBlogStatusesForRole(profile.role)
  if (!allowedStatuses.length) redirect('/dashboard')

  const status = normalizeStatus(String(formData.get('status') ?? allowedStatuses[0]), allowedStatuses)

  const { data: existing, error: existingError } = await supabase
    .from('blog_posts')
    .select('author_id,status,published_at')
    .eq('id', postId)
    .single()

  if (existingError) throw existingError

  if (!canEditBlogPost(profile, existing)) {
    redirect('/dashboard/blog-posts')
  }

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

export async function setBlogPostStatusAction(postId: string, formData: FormData) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') redirect('/dashboard')

  const supabase = await createSupabaseServerClient()

  const { data: existing, error: existingError } = await supabase
    .from('blog_posts')
    .select('author_id,status,published_at')
    .eq('id', postId)
    .single()

  if (existingError) throw existingError

  const requested = String(formData.get('status') ?? '')
  const isPublishOrArchive = requested === 'published' || requested === 'archived'

  if (isPublishOrArchive) {
    if (profile.role === 'alumni' || profile.role === 'donor') redirect('/dashboard/blog-posts')
    if (profile.role === 'teacher' && existing.author_id !== profile.id) redirect('/dashboard/blog-posts')
    if (!(profile.role === 'admin' || profile.role === 'teacher')) redirect('/dashboard/blog-posts')
  } else if (!canEditBlogPost(profile, existing)) {
    redirect('/dashboard/blog-posts')
  }

  const allowedStatuses = allowedBlogStatusesForRole(profile.role)
  if (!allowedStatuses.length) redirect('/dashboard/blog-posts')

  const status = normalizeStatus(requested || allowedStatuses[0], allowedStatuses)
  const nextPublishedAt = status === 'published' ? existing.published_at ?? new Date().toISOString() : null

  const { error } = await supabase
    .from('blog_posts')
    .update({ status, published_at: nextPublishedAt })
    .eq('id', postId)

  if (error) throw error

  redirect('/dashboard/blog-posts')
}
