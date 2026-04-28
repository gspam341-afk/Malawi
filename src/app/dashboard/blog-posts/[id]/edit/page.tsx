import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Tags,
  UploadCloud,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateBlogPostAction } from '@/app/dashboard/blog-posts/actions'
import { BlogMarkdownEditor } from '@/components/dashboard/BlogMarkdownEditor'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashCheckbox, dashInput, dashSelect, dashTextarea } from '@/components/dashboard/classes'
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

  const [{ data: subjects }, { data: links }] = await Promise.all([
    supabase.from('subjects').select('id,name').order('name'),
    supabase.from('blog_post_subjects').select('subject_id').eq('blog_post_id', id),
  ])

  const selected = new Set((links ?? []).map((l) => l.subject_id))

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Editor"
        title="Edit blog post"
        description="Update Markdown, subjects and publishing. Alumni and donors can only edit draft, pending, or rejected posts."
        backHref="/dashboard/blog-posts"
        backLabel="Blog posts"
        titleIcon={Newspaper}
      />

      <form action={updateBlogPostAction.bind(null, id)} className="grid gap-8">
        <FormSection icon={FileText} title="Post basics" description="Titles and URLs show up on the public blog listing.">
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

        <FormSection icon={Tags} title="Relevant subjects" description="Choose every subject this post connects to.">
          <div className="grid gap-3 sm:grid-cols-2">
            {(subjects ?? []).map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-3 rounded-jac-md border border-jac-navy/12 bg-white px-4 py-3 shadow-jac-soft hover:border-jac-purple/25"
              >
                <input
                  type="checkbox"
                  name="subject_ids"
                  value={s.id}
                  defaultChecked={selected.has(s.id)}
                  className={dashCheckbox}
                />
                <span className="text-sm font-medium text-slate-900">{s.name}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection icon={ImageIcon} title="Cover image" description="Hero image on listings and the article header.">
          <FieldLabel htmlFor="e-cover">Cover image URL (optional)</FieldLabel>
          <input
            id="e-cover"
            name="cover_image_url"
            defaultValue={post.cover_image_url ?? ''}
            className={`${dashInput} mt-2`}
          />
          <p className="mt-2 flex items-start gap-2 text-xs text-slate-500">
            <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-jac-purple" aria-hidden />
            Upload images for the body from the content builder (stored in Supabase and inserted as Markdown).
          </p>
        </FormSection>

        <FormSection icon={BookOpen} title="Content builder" description="Structured Markdown with a live preview.">
          <BlogMarkdownEditor defaultValue={post.content ?? ''} name="content" blogPostId={id} id="e-content" />
        </FormSection>

        <FormSection icon={Eye} title="Publishing settings" description="Workflow depends on your role.">
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
          <ActionButton type="submit" icon={CheckCircle2}>
            Save changes
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
