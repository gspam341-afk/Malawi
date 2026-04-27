import { NextResponse } from 'next/server'
import { getCurrentProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const ALLOWED_ROLES = ['admin', 'teacher', 'alumni', 'donor'] as const
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function safeFileName(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
  return base || 'image'
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (profile.role === 'student_optional' || !ALLOWED_ROLES.includes(profile.role as (typeof ALLOWED_ROLES)[number])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (profile.status !== 'active') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const blogPostIdRaw = formData.get('blog_post_id')

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
  }

  const mime = file.type || 'application/octet-stream'
  if (!ALLOWED_TYPES.includes(mime)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  const blogPostId: string | null =
    typeof blogPostIdRaw === 'string' && blogPostIdRaw.trim().length > 0 ? blogPostIdRaw.trim() : null

  if (blogPostId) {
    const { data: post, error: postErr } = await supabase.from('blog_posts').select('author_id').eq('id', blogPostId).single()
    if (postErr || !post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    if (profile.role !== 'admin' && post.author_id !== profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const ts = Date.now()
  const safe = safeFileName(file.name)
  const folder = blogPostId ? `blog-posts/${blogPostId}` : `blog-posts/drafts/${profile.id}`
  const path = `${folder}/${ts}-${safe}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: upErr } = await supabase.storage.from('blog-images').upload(path, buffer, {
    contentType: mime,
    upsert: false,
  })

  if (upErr) {
    console.error(upErr)
    return NextResponse.json({ error: upErr.message ?? 'Upload failed' }, { status: 500 })
  }

  const { data: pub } = supabase.storage.from('blog-images').getPublicUrl(path)

  return NextResponse.json({ url: pub.publicUrl, path })
}
