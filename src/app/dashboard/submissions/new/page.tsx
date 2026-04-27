import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { createSubmissionAction } from '@/app/dashboard/submissions/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashInput, dashTextarea } from '@/components/dashboard/classes'

export default async function NewSubmissionPage() {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-8 text-center text-sm text-slate-700">
        Optional student accounts cannot create submissions here.
      </div>
    )
  }

  const allowed =
    profile.role === 'admin' || profile.role === 'teacher' || profile.role === 'alumni' || profile.role === 'donor'
  if (!allowed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-700">
        You do not have access to create submissions.
      </div>
    )
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Submit"
        title="Share an activity idea"
        description="Tell us what you tried in class or what teachers could adapt. Attach a link or file URL — the team reviews before anything goes public."
        backHref="/dashboard/submissions"
        backLabel="Submissions"
      />

      <form action={createSubmissionAction} className="grid gap-8">
        <FormSection title="Details">
          <div className="grid gap-5">
            <div>
              <FieldLabel htmlFor="sub-title">Title</FieldLabel>
              <input id="sub-title" name="title" required className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="sub-desc">Description</FieldLabel>
              <textarea id="sub-desc" name="description" rows={6} className={`${dashTextarea} mt-2 leading-relaxed`} />
            </div>
            <div>
              <FieldLabel htmlFor="sub-type">Submission type</FieldLabel>
              <select id="sub-type" name="submission_type" defaultValue="activity_idea" className={`${dashInput} mt-2`}>
                <option value="blog_post">blog_post</option>
                <option value="activity_idea">activity_idea</option>
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="sub-file" hint="Paste a hosted file URL if you already uploaded somewhere.">
                File URL (optional)
              </FieldLabel>
              <input id="sub-file" name="file_url" placeholder="https://" className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="sub-ext">External link (optional)</FieldLabel>
              <input id="sub-ext" name="external_link" placeholder="https://" className={`${dashInput} mt-2`} />
            </div>
          </div>
        </FormSection>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-8">
          <Link href="/dashboard/submissions" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </Link>
          <ActionButton type="submit">Submit for review</ActionButton>
        </div>
      </form>
    </div>
  )
}
