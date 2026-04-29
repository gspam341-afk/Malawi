import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookOpen, LibraryBig, SearchX } from 'lucide-react'
import { CourseCard } from '@/components/public/CourseCard'
import { ResourceCard } from '@/components/ResourceCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { MathQuickfireModal } from '@/components/public/MathQuickfireModal'
import { MathEscapeRoomModal } from '@/components/public/MathEscapeRoomModal'
import { CalmMathPuzzleModal } from '@/components/public/CalmMathPuzzleModal'
import { FunctionDetectiveModal } from '@/components/public/FunctionDetectiveModal'
import { NewtonChaosLabModal } from '@/components/public/NewtonChaosLabModal'
import { BuoyancyLabModal } from '@/components/public/BuoyancyLabModal'
import { MoleculeCatcherModal } from '@/components/public/MoleculeCatcherModal'
import { getPublicCourses } from '@/lib/queries/publicCourses'
import { getPublicResources, getSubjects } from '@/lib/queries/publicResources'
import { slugify } from '@/lib/slugify'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const subjects = await getSubjects()
  const subject = subjects.find((s) => slugify(s.name) === slug)

  if (!subject) {
    return {
      title: 'Subject not found — Jacaranda School',
    }
  }

  return {
    title: `${subject.name} — Jacaranda Subjects`,
    description: `Browse ${subject.name} courses and activities at Jacaranda School.`,
  }
}

export default async function SubjectDetailPage({ params }: Props) {
  const { slug } = await params
  const subjects = await getSubjects()
  const subject = subjects.find((s) => slugify(s.name) === slug)
  if (!subject) notFound()

  const [courses, resources] = await Promise.all([
    getPublicCourses({ subjectId: subject.id }),
    getPublicResources({ subject: subject.id }),
  ])

  return (
    <div className="grid gap-10 md:gap-12">
      <PageHeader
        eyebrow="Jacaranda School · Subject"
        title={subject.name}
        description={`Explore published courses and classroom activities for ${subject.name}.`}
        icon={BookOpen}
        displayTitle
        actions={
          <ButtonLink href="/courses" variant="outline">
            All courses
          </ButtonLink>
        }
      />

      <section className="grid gap-6">
        <h2 className="text-h3 font-semibold text-jac-navy">Courses</h2>
        {courses.length ? (
          <ul className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {courses.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={LibraryBig}
            title={`No ${subject.name} courses yet`}
            description="New subject courses will appear here when they are published."
          />
        )}
      </section>

      <section className="grid gap-6">
        <h2 className="text-h3 font-semibold text-jac-navy">Activities</h2>
        {resources.length ? (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={`No ${subject.name} activities yet`}
            description="New activities will appear here when they are published."
          />
        )}
      </section>

      {subject.name === 'Mathematics' ? (
        <section className="grid gap-4">
          <h2 className="text-h3 font-semibold text-jac-navy">Gaming section</h2>
          <p className="max-w-3xl text-body md:text-base">
            Choose a game mode: quick practice, escape challenge, calm puzzle strategy, or function-detective cases.
          </p>
          <div className="grid gap-5 lg:grid-cols-3">
            <MathQuickfireModal />
            <MathEscapeRoomModal />
            <CalmMathPuzzleModal />
            <FunctionDetectiveModal />
          </div>
        </section>
      ) : null}

      {subject.name === 'Physics' ? (
        <section className="grid gap-4">
          <h2 className="text-h3 font-semibold text-jac-navy">Gaming section</h2>
          <p className="max-w-3xl text-body md:text-base">
            Try interactive physics gameplay focused on Newton’s laws, buoyancy, and density.
          </p>
          <div className="grid gap-5 lg:grid-cols-3">
            <NewtonChaosLabModal />
            <BuoyancyLabModal />
          </div>
        </section>
      ) : null}

      {subject.name === 'Chemistry' ? (
        <section className="grid gap-4">
          <h2 className="text-h3 font-semibold text-jac-navy">Gaming section</h2>
          <p className="max-w-3xl text-body md:text-base">
            Practice core chemistry ideas by building molecules from atoms.
          </p>
          <div className="grid gap-5 lg:grid-cols-3">
            <MoleculeCatcherModal />
          </div>
        </section>
      ) : null}
    </div>
  )
}
