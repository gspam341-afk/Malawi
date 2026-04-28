import Link from 'next/link'
import { ArrowRight, BookMarked } from 'lucide-react'
import { getLatestPublishedCourses } from '@/lib/queries/publicCourses'
import { CourseCard } from '@/components/public/CourseCard'
import { ButtonLink } from '@/components/ui/Button'

/** Latest published public courses for the homepage — hidden when empty. */
export async function LatestCoursesSection() {
  const courses = await getLatestPublishedCourses(3)
  if (!courses.length) return null

  return (
    <section className="rounded-jac-xl border-2 border-jac-blue/20 bg-gradient-to-br from-white via-jac-blue/[0.06] to-jac-purple/[0.08] px-6 py-12 shadow-[0_12px_40px_-12px_rgba(46,122,168,0.15)] md:px-12 lg:rounded-[40px]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-jac-blue md:text-sm">
              <BookMarked className="h-4 w-4" aria-hidden />
              New on the Learning Hub
            </p>
            <h2 className="text-h2 mt-3">Latest courses</h2>
            <p className="mt-3 max-w-2xl text-base text-jac-navy/80 md:text-lg">
              Short learning paths with units and lessons — with activities and printables linked where teachers add them.
            </p>
          </div>
          <ButtonLink href="/courses" variant="outline" icon={BookMarked} iconRight={ArrowRight}>
            All courses
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-body">
          <Link href="/courses" className="font-medium text-jac-purple underline-offset-4 hover:underline">
            Browse every published course
          </Link>
        </p>
      </div>
    </section>
  )
}
