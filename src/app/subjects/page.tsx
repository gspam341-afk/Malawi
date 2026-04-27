import type { Metadata } from 'next'
import { StemPathwayGrid } from '@/components/public/StemPathwayGrid'

export const metadata: Metadata = {
  title: 'Subjects — Jacaranda School STEM',
  description: 'Choose a STEM pathway to explore activities by subject at Jacaranda School.',
}

export default function SubjectsPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 pb-8">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Subjects</h1>
        <p className="mt-4 text-xl font-medium text-emerald-900">Choose a STEM pathway to explore activities by subject.</p>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Each pathway only shows the activities that belong to that STEM area, so you can focus on the subjects you are
          preparing for.
        </p>
      </header>
      <StemPathwayGrid />
    </div>
  )
}
