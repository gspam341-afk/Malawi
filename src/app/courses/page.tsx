import type { Metadata } from 'next'
import { LibraryBig, Search } from 'lucide-react'
import { CourseCard } from '@/components/public/CourseCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { dashInput } from '@/components/dashboard/classes'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'
import { getPublicCourses } from '@/lib/queries/publicCourses'
import { ActionButton } from '@/components/dashboard/ActionButton'

export const metadata: Metadata = {
  title: 'Courses — Jacaranda Learning Hub',
  description: 'Browse published courses by subject and grade at Jacaranda School.',
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

export default async function CoursesPage({ searchParams }: Props) {
  const sp = await searchParams
  const subjectId = getParam(sp, 'subject') ?? ''
  const gradeId = getParam(sp, 'grade') ?? ''
  const q = getParam(sp, 'q') ?? ''

  const [subjects, gradeLevels, courses] = await Promise.all([
    getSubjects(),
    getGradeLevels(),
    getPublicCourses({
      subjectId: subjectId || undefined,
      gradeId: gradeId || undefined,
      q: q || undefined,
    }),
  ])

  return (
    <div className="grid gap-10 md:gap-12">
      <PageHeader
        eyebrow="Jacaranda Learning Hub"
        title="Courses"
        description="Published learning paths with units and lessons. Teachers link activities and printables inside lessons so you can prepare before class."
        icon={LibraryBig}
        displayTitle
      />

      <section className="rounded-jac-xl border-2 border-jac-purple/15 bg-white/95 p-6 shadow-jac-soft md:p-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-jac-navy">
          <Search className="h-4 w-4 text-jac-purple" aria-hidden />
          Find a course
        </h2>
        <p className="mt-1 text-sm text-jac-navy/70">Filter by subject or grade, or search the title and description.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-12" method="get">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-jac-navy/55">Search</label>
            <input name="q" defaultValue={q} placeholder="Title or description…" className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-jac-navy/55">Subject</label>
            <select name="subject" defaultValue={subjectId} className={`${dashInput} mt-2`}>
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-jac-navy/55">Grade</label>
            <select name="grade" defaultValue={gradeId} className={`${dashInput} mt-2`}>
              <option value="">All grades</option>
              {gradeLevels.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto" icon={Search}>
              Apply
            </ActionButton>
          </div>
        </form>
      </section>

      {courses.length ? (
        <ul className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={LibraryBig}
          title="No courses match your filters"
          description="Try clearing filters or explore STEM pathways and standalone activities while new courses are published."
        />
      )}
    </div>
  )
}
