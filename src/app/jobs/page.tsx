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
    <div className="mx-auto grid w-full max-w-3xl gap-10 pb-8">
      <div className="flex flex-wrap items-start gap-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 ring-1 ring-emerald-600/15">
          <Briefcase className="h-9 w-9" aria-hidden />
        </span>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Jobs</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Explore future learning and career inspiration connected to STEM subjects at Jacaranda School.
          </p>
        </div>
      </div>

      <Card className="border-dashed border-slate-200 bg-white/95 p-10 text-center" padding="p-10">
        <Compass className="mx-auto h-12 w-12 text-emerald-800" aria-hidden />
        <p className="mt-6 text-lg font-medium text-slate-900">Job inspiration will be added later.</p>
        <p className="mt-2 text-slate-600">
          For now, explore STEM activities through <span className="font-semibold text-slate-800">Subjects</span> and
          prepare for class with hands-on ideas.
        </p>
        <GraduationCap className="mx-auto mt-6 h-8 w-8 text-slate-400" aria-hidden />
      </Card>

      <div className="flex justify-center">
        <ButtonLink href="/subjects" icon={Compass} iconRight={ArrowRight}>
          Explore subjects
        </ButtonLink>
      </div>

      <p className="text-center text-sm text-slate-500">
        Looking for activities only?{' '}
        <Link href="/resources" className="font-medium text-emerald-800 underline-offset-4 hover:underline">
          Browse all activities
        </Link>
        .
      </p>
    </div>
  )
}
