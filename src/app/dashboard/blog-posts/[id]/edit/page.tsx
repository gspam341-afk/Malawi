import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateBlogPostAction } from '@/app/dashboard/blog-posts/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashInput, dashSelect, dashTextarea } from '@/components/dashboard/classes'
import type { Tables } from '@/types/db'

type BlogStatus = Tables['blog_posts']['Row']['status']

function allowedBlogStatusesForRole(role: Tables['profiles']['Row']['role']): readonly BlogStatus[] {
  if (role === 'admin') return ['draft', 'pending', 'published', 'rejected', 'archived']
  if (role === 'teacher') return ['draft', 'pending', 'published', 'archived']
  if (role === 'alumni' || role === 'donor') return ['draft', 'pending']
  return []
}

export default async function EditBlogPostPage(props: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-8 text-center text-sm text-slate-700">
        Blog authoring is not available for optional student accounts.
      </div>
    )
  }

  const allowedStatuses = allowedBlogStatusesForRole(profile.role)
  if (!allowedStatuses.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-700">
        You do not have access to edit blog posts.
      </div>
    )
  }

  const { id } = await props.params

  const supabase = await createSupabaseServerClient()
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,content,cover_image_url,status,author_id')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!post) notFound()

  if (profile.role !== 'admin' && post.author_id !== profile.id) {
    notFound()
  }

  if (
    (profile.role === 'alumni' || profile.role === 'donor') &&
    !(post.status === 'draft' || post.status === 'pending' || post.status === 'rejected')
  ) {
    notFound()
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Editor"
        title="Edit blog post"
        description="Update copy, imagery, or publishing state. Alumni and donors can only edit draft, pending, or rejected posts."
        backHref="/dashboard/blog-posts"
        backLabel="Blog posts"
      />

      <form action={updateBlogPostAction.bind(null, id)} className="grid gap-8">
        <FormSection title="Post basics">
          <div className="grid gap-5">
            <div>
              <FieldLabel htmlFor="e-title">Title</FieldLabel>
              <input id="e-title" name="title" required defaultValue={post.title} className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="e-slug">Slug</FieldLabel>
              <input id="e-slug" name="slug" defaultValue={post.slug ?? ''} className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="e-excerpt">Excerpt</FieldLabel>
              <textarea
                id="e-excerpt"
                name="excerpt"
                rows={3}
                defaultValue={post.excerpt ?? ''}
                className={`${dashTextarea} mt-2 leading-relaxed`}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Content">
          <div>
            <FieldLabel htmlFor="e-body">Article body</FieldLabel>
            <textarea
              id="e-body"
              name="content"
              rows={14}
              defaultValue={post.content ?? ''}
              className={`${dashTextarea} mt-2 text-base leading-relaxed`}
            />
          </div>
          <div className="mt-6">
            <FieldLabel htmlFor="e-cover">Cover image URL</FieldLabel>
            <input
              id="e-cover"
              name="cover_image_url"
              defaultValue={post.cover_image_url ?? ''}
              className={`${dashInput} mt-2`}
            />
          </div>
        </FormSection>

        <FormSection title="Publishing">
          <div className="max-w-md">
            <FieldLabel htmlFor="e-status">Status</FieldLabel>
            <select id="e-status" name="status" defaultValue={post.status} className={`${dashSelect} mt-2`}>
              {allowedStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </FormSection>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-8">
          <Link href="/dashboard/blog-posts" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </Link>
          <ActionButton type="submit">Save changes</ActionButton>
        </div>
      </form>
    </div>
  )
}
