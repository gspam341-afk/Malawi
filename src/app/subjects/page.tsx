import type { Metadata } from 'next'
import Link from 'next/link'
import { Atom, BookOpen, FlaskConical, Leaf, Sigma } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { getSubjects } from '@/lib/queries/publicResources'
import { slugify } from '@/lib/slugify'

export const metadata: Metadata = {
  title: 'Subjects — Jacaranda School STEM',
  description: 'Browse school subjects and explore activities and courses at Jacaranda School.',
}

const SUBJECT_ORDER = ['Biology', 'Chemistry', 'Physics', 'Agriculture', 'Mathematics'] as const

const SUBJECT_META: Record<
  (typeof SUBJECT_ORDER)[number],
  { icon: typeof BookOpen; color: string; description: string }
> = {
  Biology: {
    icon: Atom,
    color: 'text-jac-purple bg-jac-purple/12 ring-jac-purple/20',
    description: 'Life systems, ecosystems, and practical investigations.',
  },
  Chemistry: {
    icon: FlaskConical,
    color: 'text-jac-blue bg-jac-blue/12 ring-jac-blue/20',
    description: 'Materials, reactions, and hands-on lab-based learning.',
  },
  Physics: {
    icon: BookOpen,
    color: 'text-jac-pink bg-jac-pink/18 ring-jac-pink/30',
    description: 'Forces, energy, motion, and real-world science concepts.',
  },
  Agriculture: {
    icon: Leaf,
    color: 'text-jac-green bg-jac-green/12 ring-jac-green/20',
    description: 'Farming systems, sustainability, and applied field learning.',
  },
  Mathematics: {
    icon: Sigma,
    color: 'text-[#8a5200] bg-jac-orange/15 ring-jac-orange/25',
    description: 'Numbers, patterns, and problem-solving for everyday contexts.',
  },
}

export default async function SubjectsPage() {
  const subjects = await getSubjects()
  const byName = new Map(subjects.map((s) => [s.name, s]))
  const orderedSubjects = SUBJECT_ORDER.map((name) => byName.get(name)).filter((s) => Boolean(s))

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 pb-12 md:gap-16">
      <PageHeader
        eyebrow="Jacaranda School · Grade 6–14"
        title="Subjects"
        description={
          <>
            <span className="block font-medium text-jac-navy">
              Browse subjects to explore activities and courses.
            </span>
            <span className="mt-4 block font-normal leading-relaxed text-jac-navy/75">
              This page is organized by school subjects, not by STEM tracks. You can explore{' '}
              <span className="font-medium text-jac-navy">Biology</span>, <span className="font-medium text-jac-navy">Chemistry</span>,{' '}
              <span className="font-medium text-jac-navy">Physics</span>, <span className="font-medium text-jac-navy">Agriculture</span>, and{' '}
              <span className="font-medium text-jac-navy">Mathematics</span>. Each subject area includes{' '}
              <span className="font-medium text-jac-navy">published courses</span> and{' '}
              <span className="font-medium text-jac-navy">standalone activities</span>. Open{' '}
              <Link
                className="font-medium text-jac-purple underline-offset-4 hover:underline"
                href="/courses"
              >
                All courses
              </Link>{' '}
              to browse every public course by subject or grade level.
            </span>
          </>
        }
        icon={BookOpen}
        displayTitle
      />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orderedSubjects.map((subject) => {
          const meta = SUBJECT_META[subject.name as keyof typeof SUBJECT_META]
          if (!meta) return null
          const Icon = meta.icon

          return (
            <Card
              key={subject.id}
              className="flex h-full flex-col border border-jac-purple/16 shadow-[0_2px_10px_rgba(28,24,48,0.08)]"
              padding="p-6"
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-jac-md ring-1 ${meta.color}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-h4 font-semibold text-jac-navy">{subject.name}</h2>
              <p className="mt-2 text-body">{meta.description}</p>
              <div className="mt-6 flex flex-col gap-2">
                <Link href={`/subjects/${slugify(subject.name)}`} className="text-sm font-semibold text-jac-purple hover:underline">
                  Explore {subject.name}
                </Link>
              </div>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
