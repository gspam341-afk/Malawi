import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase, Compass, GraduationCap } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Jobs — Jacaranda School',
  description: 'Future learning and career inspiration connected to STEM at Jacaranda School.',
}

export default function JobsPage() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-10 pb-12 md:gap-12">
      <div className="flex flex-wrap items-start gap-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-jac-lg bg-jac-purple/12 text-jac-purple ring-1 ring-jac-purple/20">
          <Briefcase className="h-9 w-9" aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-[32px] leading-tight text-jac-navy md:text-[48px]">Jobs</h1>
          <p className="mt-4 text-base leading-relaxed text-jac-navy/75 md:text-lg">
            Explore future learning and career inspiration connected to STEM subjects at Jacaranda School.
          </p>
        </div>
      </div>

      <Card
        className="border border-dashed border-jac-purple/25 bg-gradient-to-br from-white via-jac-pink/15 to-jac-purple/5 text-center shadow-jac-soft"
        padding="p-10 md:p-12"
      >
        <Compass className="mx-auto h-12 w-12 text-jac-purple" aria-hidden />
        <p className="mt-6 text-lg font-medium text-jac-navy">Job inspiration will be added later.</p>
        <p className="mt-2 text-jac-navy/70">
          For now, explore STEM activities through <span className="font-semibold text-jac-navy">Subjects</span> and
          prepare for class with hands-on ideas.
        </p>
        <GraduationCap className="mx-auto mt-6 h-8 w-8 text-jac-navy/35" aria-hidden />
      </Card>

      <div className="flex justify-center">
        <ButtonLink href="/subjects" icon={Compass} iconRight={ArrowRight}>
          Explore subjects
        </ButtonLink>
      </div>

      <p className="text-center text-body text-jac-navy/60">
        Looking for activities only?{' '}
        <Link href="/resources" className="font-medium text-jac-purple underline-offset-4 hover:underline">
          Browse all activities
        </Link>
        .
      </p>
    </div>
  )
}
