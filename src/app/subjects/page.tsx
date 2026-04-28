import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { StemPathwayGrid } from '@/components/public/StemPathwayGrid'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Subjects — Jacaranda School STEM',
  description: 'Choose a STEM pathway to explore activities by subject at Jacaranda School.',
}

export default function SubjectsPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 pb-12 md:gap-16">
      <PageHeader
        eyebrow="Jacaranda School · Grade 6–14"
        title="Subjects"
        description={
          <>
            <span className="block font-medium text-jac-navy">
              Choose a STEM pathway to explore activities by subject.
            </span>
            <span className="mt-4 block font-normal leading-relaxed text-jac-navy/75">
              Each pathway shows <span className="font-medium text-jac-navy">published courses</span> and{' '}
              <span className="font-medium text-jac-navy">standalone activities</span> mapped to that STEM area —
              Physics, Chemistry and Biology under Science; Agriculture under Engineering; Mathematics on its own track.
              Open{' '}
              <Link
                className="font-medium text-jac-purple underline-offset-4 hover:underline"
                href="/courses"
              >
                All courses
              </Link>{' '}
              to search every public course by subject or grade.
            </span>
          </>
        }
        icon={BookOpen}
        displayTitle
      />
      <StemPathwayGrid />
    </div>
  )
}
