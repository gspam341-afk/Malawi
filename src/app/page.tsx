import {
  ArrowRight,
  BookMarked,
  BookOpen,
  ClipboardList,
  Compass,
  Globe2,
  GraduationCap,
  Printer,
  Route,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserCheck,
} from 'lucide-react'
import { LatestBlogSection } from '@/components/public/LatestBlogSection'
import { LatestCoursesSection } from '@/components/public/LatestCoursesSection'
import { StemPathwayGrid } from '@/components/public/StemPathwayGrid'
import { ButtonLink } from '@/components/ui/Button'

export default async function Home() {
  return (
    <div className="grid w-full gap-16 pb-16 md:gap-[var(--space-2xl)] lg:gap-[112px]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-jac-xl border border-jac-purple/22 bg-white px-6 py-14 shadow-[0_3px_12px_rgba(28,24,48,0.08)] md:px-14 md:py-20 lg:rounded-[40px] lg:py-24">
        <div className="jac-blob bg-jac-purple/16 -right-16 -top-16 h-72 w-72 md:right-0 md:top-0" aria-hidden />
        <div className="jac-blob bg-jac-pink/18 -bottom-12 left-0 h-64 w-64" aria-hidden />

        <div className="relative mx-auto max-w-4xl text-center lg:max-w-5xl">
          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-jac-purple/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-jac-purple ring-1 ring-jac-purple/25 md:text-sm">
            <Sparkles className="h-5 w-5" aria-hidden />
            Jacaranda School
          </p>
          <h1 className="text-h1 mx-auto mt-6 max-w-4xl">
            Jacaranda Learning Hub — STEM for every curious mind
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-jac-navy/[0.92] md:text-lg">
            Explore <span className="font-semibold text-jac-navy">courses with units and lessons</span>, browse{' '}
            <span className="font-semibold text-jac-navy">hands-on activities and printables</span>, and prepare for class
            from <span className="font-semibold text-jac-navy">Grade 6 to Grade 14</span> — no account needed on the
            public site.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/subjects" icon={BookOpen} iconRight={ArrowRight}>
              Explore subjects
            </ButtonLink>
            <ButtonLink href="/courses" variant="secondary" icon={BookMarked} iconRight={ArrowRight}>
              Browse courses
            </ButtonLink>
            <ButtonLink href="/login" variant="outline" icon={GraduationCap}>
              Teacher login
            </ButtonLink>
          </div>
          <p className="mx-auto mt-10 inline-flex max-w-xl flex-wrap items-center justify-center gap-2 text-center text-body">
            <Compass className="h-4 w-4 shrink-0 text-jac-purple" aria-hidden />
            Students can explore public courses, lessons and activities without signing in.
          </p>
        </div>
      </section>

      <LatestCoursesSection />

      <LatestBlogSection />

      {/* STEM pathways */}
      <section className="grid gap-10 md:gap-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">Choose your STEM pathway</h2>
          <p className="mt-6 text-base leading-relaxed text-jac-navy/[0.88] md:text-lg">
            Pick a category to explore activities connected to your subjects. Each pathway only shows the activities
            that belong to that STEM area.
          </p>
        </div>
        <StemPathwayGrid />
      </section>

      {/* Student curiosity */}
      <section className="rounded-jac-xl border border-jac-pink/26 bg-white px-6 py-14 shadow-[0_3px_12px_rgba(28,24,48,0.08)] md:px-12 lg:rounded-[40px]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">Learn by exploring</h2>
          <p className="mt-6 text-base text-jac-navy/80 md:text-lg">
            Activities help you become curious before class — see what you need, prepare for lessons and connect STEM to
            the real world.
          </p>
        </div>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8">
          <li className="rounded-jac-lg border border-jac-purple/20 bg-white p-6 shadow-[0_2px_10px_rgba(28,24,48,0.08)] md:p-8">
            <Compass className="h-10 w-10 text-jac-purple" aria-hidden />
            <h3 className="mt-5 text-h4 font-semibold text-jac-navy">Explore before class</h3>
            <p className="mt-3 text-body">
              Skim outcomes and materials so you walk in ready to participate.
            </p>
          </li>
          <li className="rounded-jac-lg border border-jac-blue/24 bg-white p-6 shadow-[0_2px_10px_rgba(28,24,48,0.08)] md:p-8">
            <ClipboardList className="h-10 w-10 text-jac-blue" aria-hidden />
            <h3 className="mt-5 text-h4 font-semibold text-jac-navy">Understand what you need</h3>
            <p className="mt-3 text-body">
              Check timing, group size and supplies before the lesson starts.
            </p>
          </li>
          <li className="rounded-jac-lg border border-jac-green/24 bg-white p-6 shadow-[0_2px_10px_rgba(28,24,48,0.08)] md:p-8">
            <Globe2 className="h-10 w-10 text-jac-green" aria-hidden />
            <h3 className="mt-5 text-h4 font-semibold text-jac-navy">Connect subjects to real life</h3>
            <p className="mt-3 text-body">
              See how science, maths, agriculture and more show up beyond the textbook.
            </p>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
        <div>
          <h2 className="text-h2">How it works</h2>
          <p className="mt-4 text-base text-jac-navy/75 md:text-lg">Four simple steps from browsing to showing up prepared.</p>
        </div>
        <ol className="grid gap-4 md:gap-5">
          {[
            { Icon: Route, text: 'Choose a STEM pathway that matches what you are studying.' },
            { Icon: GraduationCap, text: 'Pick your grade level to narrow the list.' },
            { Icon: BookOpen, text: 'Open an activity to read outcomes and materials.' },
            { Icon: Printer, text: 'Prepare materials or questions for class — or print what you need.' },
          ].map((step, i) => (
            <li
              key={step.text}
              className="flex gap-4 rounded-jac-lg border border-jac-purple/12 bg-white p-5 shadow-[0_2px_8px_rgba(28,24,48,0.08)] hover:border-jac-purple/22 md:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-jac-md bg-jac-purple/12 text-jac-purple ring-1 ring-jac-purple/15">
                <step.Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-jac-navy/50">Step {i + 1}</p>
                <p className="mt-1 text-base leading-relaxed text-jac-navy/85">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Teachers */}
      <section className="rounded-jac-xl border border-jac-navy/12 bg-jac-offwhite/75 px-6 py-12 shadow-[0_3px_12px_rgba(28,24,48,0.08)] md:px-12 lg:rounded-[40px]">
        <h2 className="text-h3 font-semibold text-jac-navy">For teachers</h2>
        <p className="mt-4 max-w-2xl text-body md:text-base">
          Teachers can log in to create and publish hands-on activities for their classes. Administrators manage users
          and platform settings so the space stays safe and organised.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3 md:gap-6">
          <li className="flex gap-3 rounded-jac-md bg-jac-offwhite p-5 shadow-jac-soft ring-1 ring-jac-purple/10 md:p-6">
            <UserCheck className="h-6 w-6 shrink-0 text-jac-green" aria-hidden />
            <span className="text-body md:text-sm">
              <span className="font-semibold text-jac-navy">Teachers</span> sign in to add and publish activities.
            </span>
          </li>
          <li className="flex gap-3 rounded-jac-md bg-jac-offwhite p-5 shadow-jac-soft ring-1 ring-jac-purple/10 md:p-6">
            <UploadCloud className="h-6 w-6 shrink-0 text-jac-purple" aria-hidden />
            <span className="text-body md:text-sm">
              <span className="font-semibold text-jac-navy">Publish</span> printable and classroom-ready resources.
            </span>
          </li>
          <li className="flex gap-3 rounded-jac-md bg-jac-offwhite p-5 shadow-jac-soft ring-1 ring-jac-purple/10 md:p-6">
            <ShieldCheck className="h-6 w-6 shrink-0 text-jac-blue" aria-hidden />
            <span className="text-body md:text-sm">
              <span className="font-semibold text-jac-navy">Admins</span> oversee users and settings.
            </span>
          </li>
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/login" icon={GraduationCap}>
            Teacher login
          </ButtonLink>
          <ButtonLink href="/resources" variant="outline" icon={BookOpen}>
            All activities
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
