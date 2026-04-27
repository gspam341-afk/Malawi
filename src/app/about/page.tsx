import type { Metadata } from 'next'
import { BookOpen, GraduationCap, Sparkles, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'About us — Jacaranda School STEM',
  description:
    'A learning space for Jacaranda School students to explore STEM activities and prepare for class.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-12 pb-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">About us</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
          This learning space is built for Jacaranda School students to explore STEM activities, prepare for class and
          become more curious about science, technology, engineering and mathematics.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white" padding="p-6">
          <Users className="h-10 w-10 text-emerald-800" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">For students</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Browse public activities without logging in. Explore pathways, filter by grade and get ready for lessons.
          </p>
        </Card>
        <Card className="border-teal-100 bg-gradient-to-b from-teal-50/60 to-white" padding="p-6">
          <GraduationCap className="h-10 w-10 text-teal-800" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">For teachers</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in to create and publish hands-on activities for your classes.
          </p>
        </Card>
        <Card className="border-sky-100 bg-gradient-to-b from-sky-50/60 to-white" padding="p-6">
          <Sparkles className="h-10 w-10 text-sky-800" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">For Jacaranda School</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            A shared space for learning, preparation and curiosity across STEM subjects.
          </p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white/95" padding="p-8">
        <div className="flex flex-wrap items-start gap-4">
          <BookOpen className="h-8 w-8 shrink-0 text-emerald-800" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Explore STEM through doing</h2>
            <p className="mt-2 text-slate-600">
              We focus on physical activities, printable materials and classroom challenges — so learning feels concrete,
              engaging and connected to your school day.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
