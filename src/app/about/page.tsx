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
    <div className="mx-auto grid w-full max-w-4xl gap-12 pb-12 md:gap-16">
      <header className="text-center">
        <h1 className="font-display text-[32px] leading-tight text-jac-navy md:text-[48px]">About us</h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-jac-navy/75 md:text-lg">
          This learning space is built for Jacaranda School students to explore STEM activities, prepare for class and
          become more curious about science, technology, engineering and mathematics.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        <Card
          className="border border-jac-pink/30 bg-gradient-to-b from-jac-pink/25 to-white shadow-jac-soft"
          padding="p-6 md:p-8"
        >
          <Users className="h-10 w-10 text-jac-purple" aria-hidden />
          <h2 className="mt-4 text-h4 font-normal text-jac-navy">For students</h2>
          <p className="mt-2 text-body leading-relaxed text-jac-navy/75">
            Browse public activities without logging in. Explore pathways, filter by grade and get ready for lessons.
          </p>
        </Card>
        <Card
          className="border border-jac-purple/15 bg-gradient-to-b from-jac-purple/8 to-white shadow-jac-soft"
          padding="p-6 md:p-8"
        >
          <GraduationCap className="h-10 w-10 text-jac-purple" aria-hidden />
          <h2 className="mt-4 text-h4 font-normal text-jac-navy">For teachers</h2>
          <p className="mt-2 text-body leading-relaxed text-jac-navy/75">
            Sign in to create and publish hands-on activities for your classes.
          </p>
        </Card>
        <Card
          className="border border-jac-green/20 bg-gradient-to-b from-jac-green/10 to-white shadow-jac-soft"
          padding="p-6 md:p-8"
        >
          <Sparkles className="h-10 w-10 text-jac-green" aria-hidden />
          <h2 className="mt-4 text-h4 font-normal text-jac-navy">For Jacaranda School</h2>
          <p className="mt-2 text-body leading-relaxed text-jac-navy/75">
            A shared space for learning, preparation and curiosity across STEM subjects.
          </p>
        </Card>
      </div>

      <Card className="border border-jac-purple/12 bg-white shadow-jac-soft" padding="p-8 md:p-10">
        <div className="flex flex-wrap items-start gap-4">
          <BookOpen className="h-8 w-8 shrink-0 text-jac-blue" aria-hidden />
          <div>
            <h2 className="text-h4 font-normal text-jac-navy">Explore STEM through doing</h2>
            <p className="mt-2 text-body leading-relaxed text-jac-navy/75">
              We focus on physical activities, printable materials and classroom challenges — so learning feels concrete,
              engaging and connected to your school day.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
