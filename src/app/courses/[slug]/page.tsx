import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, GraduationCap, Library } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { subjectBadgeVariant } from '@/lib/subjectBadgeVariant'
import { getPublishedCourseBySlug } from '@/lib/queries/publicCourses'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const course = await getPublishedCourseBySlug(slug)
  if (!course) return { title: 'Course — Jacaranda Learning Hub' }
  return {
    title: `${course.title} — Jacaranda Learning Hub`,
    description: course.description ?? undefined,
  }
}

function lessonHref(courseSlug: string, lesson: { id: string; slug: string | null }) {
  return `/courses/${courseSlug}/lessons/${lesson.slug && lesson.slug.length > 0 ? lesson.slug : lesson.id}`
}

export default async function CourseOverviewPage(props: Props) {
  const { slug } = await props.params
  const course = await getPublishedCourseBySlug(slug)
  if (!course) notFound()

  return (
    <div className="grid gap-10 pb-12 md:gap-12">
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-jac-purple underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All courses
        </Link>
      </div>

      <header className="rounded-jac-xl border-2 border-jac-purple/20 bg-gradient-to-br from-white via-jac-purple/[0.05] to-jac-pink/20 px-6 py-10 shadow-[0_12px_44px_-12px_rgba(28,24,48,0.14)] md:px-10 lg:rounded-[40px]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={subjectBadgeVariant(course.subject.name)}>{course.subject.name}</Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-jac-navy ring-1 ring-jac-navy/10">
            <GraduationCap className="h-3.5 w-3.5 text-jac-purple" aria-hidden />
            {course.grade_level.name}
          </span>
        </div>
        <h1 className="text-h1 mt-5">{course.title}</h1>
        {course.description ? (
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-jac-navy/[0.88] md:text-lg">{course.description}</p>
        ) : null}
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-jac-navy/70">
          <Library className="h-4 w-4 text-jac-purple" aria-hidden />
          Work through units in order, or jump to a lesson that matches what you are revising.
        </p>
      </header>

      <section className="grid gap-8">
        <h2 className="text-h2">Units and lessons</h2>
        {course.course_units.length === 0 ? (
          <Card padding="p-8" className="border-dashed border-jac-purple/25 text-jac-navy/75">
            This course does not have any units yet. Check back soon.
          </Card>
        ) : (
          <ol className="grid gap-8">
            {course.course_units.map((unit, ui) => (
              <li key={unit.id}>
                <Card padding="p-6 md:p-8" className="border-jac-navy/10">
                  <p className="text-xs font-bold uppercase tracking-wide text-jac-purple">Unit {ui + 1}</p>
                  <h3 className="text-h3 mt-2">{unit.title}</h3>
                  {unit.description ? <p className="mt-3 text-body md:text-base">{unit.description}</p> : null}
                  {unit.lessons.length ? (
                    <ul className="mt-6 space-y-3 border-t border-jac-navy/10 pt-6">
                      {unit.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={lessonHref(course.slug, lesson)}
                            className="group flex flex-wrap items-center justify-between gap-3 rounded-jac-md border border-jac-navy/10 bg-jac-offwhite/80 px-4 py-3 shadow-jac-soft transition hover:border-jac-purple/25 hover:bg-white"
                          >
                            <span className="flex items-center gap-2 font-medium text-jac-navy">
                              <BookOpen className="h-4 w-4 text-jac-purple" aria-hidden />
                              {lesson.title}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-jac-navy/50">
                              {lesson.lesson_type.replace(/_/g, ' ')}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-jac-navy/60">Lessons will appear here when published.</p>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
