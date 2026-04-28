import Link from 'next/link'
import { Atom, Calculator, Cpu, LibraryBig, SearchX, SlidersHorizontal, Sprout } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { PublicResourceFilterForm } from '@/components/PublicResourceFilterForm'
import { ResourceCard } from '@/components/ResourceCard'
import { ButtonLink } from '@/components/ui/Button'
import { STEM_CATEGORY_LIST } from '@/lib/stemCategories'
import type { StemSlug } from '@/lib/stemCategories'
import { getGradeLevels, getPublicResources, getSubjects } from '@/lib/queries/publicResources'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

const stemChipIcon = {
  science: Atom,
  technology: Cpu,
  engineering: Sprout,
  mathematics: Calculator,
} as const

const STEM_CHIP_STYLE: Record<StemSlug, string> = {
  science:
    'border-jac-purple/25 bg-white text-jac-purple shadow-jac-soft ring-1 ring-jac-purple/15 hover:bg-jac-purple/8',
  technology:
    'border-jac-blue/25 bg-white text-jac-blue shadow-jac-soft ring-1 ring-jac-blue/20 hover:bg-jac-blue/8',
  engineering:
    'border-jac-green/30 bg-white text-jac-green shadow-jac-soft ring-1 ring-jac-green/20 hover:bg-jac-green/8',
  mathematics:
    'border-jac-orange/35 bg-white text-[#8a5200] shadow-jac-soft ring-1 ring-jac-orange/30 hover:bg-jac-orange/10',
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams

  const q = getParam(sp, 'q') ?? ''
  const grade = getParam(sp, 'grade') ?? ''
  const subject = getParam(sp, 'subject') ?? ''

  const print_required = getParam(sp, 'print_required')
  const extra_materials_required = getParam(sp, 'extra_materials_required')

  const [gradeLevels, subjects, resources] = await Promise.all([
    getGradeLevels(),
    getSubjects(),
    getPublicResources({
      q: q || undefined,
      grade: grade || undefined,
      subject: subject || undefined,
      print_required: print_required ? print_required === 'true' : undefined,
      extra_materials_required: extra_materials_required
        ? extra_materials_required === 'true'
        : undefined,
    }),
  ])

  const defaults = {
    q,
    grade,
    subject,
    print_required: print_required ?? '',
    extra_materials_required: extra_materials_required ?? '',
  }

  return (
    <div className="grid gap-10 md:gap-12">
      <PageHeader
        eyebrow="Jacaranda School"
        title="All Jacaranda STEM activities"
        description="Every published public activity across Science, Engineering, Mathematics and more — filter by grade, subject, printables and materials, or open a STEM pathway for a narrower list."
        icon={LibraryBig}
        displayTitle
      />

      <div className="rounded-jac-xl border border-jac-purple/12 bg-gradient-to-br from-white via-jac-offwhite to-jac-pink/15 p-6 shadow-jac-soft md:p-8 lg:rounded-[40px]">
        <p className="text-base leading-relaxed text-jac-navy/80 md:text-lg">
          This page shows all published activities in one place. When you want to focus on one STEM area only, use a
          pathway so you only see activities for the subjects in that category.
        </p>
        <p className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-purple md:text-sm">
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          STEM pathways
        </p>
        <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
          {STEM_CATEGORY_LIST.map((c) => {
            const ChipIcon = stemChipIcon[c.slug]
            return (
              <Link
                key={c.slug}
                href={`/stem/${c.slug}`}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 ${STEM_CHIP_STYLE[c.slug]}`}
              >
                <ChipIcon className="h-4 w-4 shrink-0" aria-hidden />
                {c.title}
              </Link>
            )
          })}
        </div>
      </div>

      <PublicResourceFilterForm action="/resources" gradeLevels={gradeLevels} subjects={subjects} defaults={defaults} />

      {resources.length ? (
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No activities match your filters"
          description="Try clearing one filter at a time, browse by STEM pathway, or check back when more resources are published."
        >
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-jac-navy/15 bg-white px-4 py-2 text-sm font-medium text-jac-navy shadow-jac-soft hover:bg-jac-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple"
          >
            Reset filters (reload)
          </Link>
          <ButtonLink href="/stem/science" variant="primary">
            Explore Science
          </ButtonLink>
        </EmptyState>
      )}
    </div>
  )
}
