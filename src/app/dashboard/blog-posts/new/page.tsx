import Link from 'next/link'
import {
  BookOpen,
  Eye,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Send,
  Tags,
  UploadCloud,
} from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createBlogPostAction } from '@/app/dashboard/blog-posts/actions'
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

export default async function NewBlogPostPage() {
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
        You do not have access to create blog posts.
      </div>
    )
  }

  const supabase = await createSupabaseServerClient()
  const { data: subjects } = await supabase.from('subjects').select('id,name').order('name')

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Editor"
        title="New blog post"
        description="Write in Markdown, tag subjects and save as draft until you are ready."
        backHref="/dashboard/blog-posts"
        backLabel="Blog posts"
        titleIcon={Newspaper}
      />

      <form action={createBlogPostAction} className="grid gap-8">
        <FormSection
          icon={FileText}
          title="Post basics"
          description="Titles and URLs show up on the public blog listing."
        >
          <div className="grid gap-5">
            <div>
              <FieldLabel htmlFor="bp-title">Title</FieldLabel>
              <input id="bp-title" name="title" required className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="bp-slug" hint="Leave blank if you only use the post ID in links.">
                Slug (optional)
              </FieldLabel>
              <input id="bp-slug" name="slug" placeholder="my-post-url" className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="bp-excerpt">Short excerpt</FieldLabel>
              <textarea id="bp-excerpt" name="excerpt" rows={3} className={`${dashTextarea} mt-2 leading-relaxed`} />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Tags}
          title="Relevant subjects"
          description="Choose every subject this post connects to."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {(subjects ?? []).map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-teal-200"
              >
                <input type="checkbox" name="subject_ids" value={s.id} className={dashCheckbox} />
                <span className="text-sm font-medium text-slate-900">{s.name}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={ImageIcon}
          title="Cover image"
          description="Hero image on the blog list and at the top of the article."
        >
          <FieldLabel htmlFor="bp-cover">Cover image URL (optional)</FieldLabel>
          <input id="bp-cover" name="cover_image_url" placeholder="https://..." className={`${dashInput} mt-2`} />
          <p className="mt-2 flex items-start gap-2 text-xs text-slate-500">
            <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
            For images inside the article, use the content builder below (upload inserts Markdown).
          </p>
        </FormSection>

        <FormSection
          icon={BookOpen}
          title="Content builder"
          description="Structured Markdown with a live preview."
        >
          <BlogMarkdownEditor defaultValue="" name="content" id="bp-content" />
        </FormSection>

        <FormSection
          icon={Eye}
          title="Publishing settings"
          description="Choose whether this stays private, waits for review, or goes live."
        >
          <div className="max-w-md">
            <FieldLabel htmlFor="bp-status">Status</FieldLabel>
            <select id="bp-status" name="status" defaultValue={allowedStatuses[0]} className={`${dashSelect} mt-2`}>
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
          <ActionButton type="submit" icon={Send}>
            Create draft
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
