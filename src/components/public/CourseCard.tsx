import Link from 'next/link'
import { ArrowRight, GraduationCap, Library } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { subjectBadgeVariant } from '@/lib/subjectBadgeVariant'
import type { PublicCourseListItem } from '@/lib/queries/publicCourses'

export function CourseCard({ course }: { course: PublicCourseListItem }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col rounded-jac-lg border-2 border-jac-purple/18 bg-white p-6 shadow-[0_10px_36px_-10px_rgba(28,24,48,0.12)] transition hover:border-jac-purple/35 hover:shadow-[0_14px_44px_-12px_rgba(115,72,206,0.18)] md:p-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={subjectBadgeVariant(course.subject.name)}>{course.subject.name}</Badge>
        <span className="inline-flex items-center gap-1 rounded-full bg-jac-offwhite px-2.5 py-1 text-xs font-medium text-jac-navy/75 ring-1 ring-jac-navy/10">
          <GraduationCap className="h-3.5 w-3.5 text-jac-purple" aria-hidden />
          {course.grade_level.name}
        </span>
      </div>
      <h2 className="font-display mt-4 text-xl leading-snug tracking-tight text-jac-navy md:text-2xl">{course.title}</h2>
      {course.description ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-jac-navy/80 md:text-base">{course.description}</p>
      ) : (
        <p className="mt-3 text-sm text-jac-navy/55">Open the course to see units and lessons.</p>
      )}
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-jac-purple">
        <Library className="h-4 w-4" aria-hidden />
        View course
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  )
}
