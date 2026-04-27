import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Atom, Calculator, Cpu, SearchX, Sprout } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { PublicResourceFilterForm } from '@/components/PublicResourceFilterForm'
import { ResourceCard } from '@/components/ResourceCard'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { getGradeLevels, getPublicResources, getSubjects } from '@/lib/queries/publicResources'
import {
  getStemCategoryEmptyCopy,
  isStemSlug,
  resolveSubjectIdsForStem,
  STEM_CATEGORIES,
  type StemSlug,
} from '@/lib/stemCategories'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

const stemHeaderIcon: Record<StemSlug, typeof Atom> = {
  science: Atom,
  technology: Cpu,
  engineering: Sprout,
  mathematics: Calculator,
}

export default async function StemCategoryPage({ params, searchParams }: Props) {
  const raw = (await params).category
  if (!isStemSlug(raw)) notFound()
  const category = raw as StemSlug
  const meta = STEM_CATEGORIES[category]
  const HeaderIcon = stemHeaderIcon[category]

  const sp = await searchParams
  const q = getParam(sp, 'q') ?? ''
  const grade = getParam(sp, 'grade') ?? ''
  const subject = getParam(sp, 'subject') ?? ''
  const print_required = getParam(sp, 'print_required')
  const extra_materials_required = getParam(sp, 'extra_materials_required')

  const [gradeLevels, subjects] = await Promise.all([getGradeLevels(), getSubjects()])

  if (meta.comingSoon) {
    return (
      <div className="grid gap-8">
        <PageHeader
          eyebrow={`STEM · ${meta.letter}`}
          title={meta.title}
          description={meta.studentDescription}
          icon={HeaderIcon}
        />

        <EmptyState
          icon={Cpu}
          title="Technology activities are coming soon"
          description="For now, explore Science, Engineering or Mathematics."
        >
          <ButtonLink href="/stem/science" variant="secondary">
            Science
          </ButtonLink>
          <ButtonLink href="/stem/engineering" variant="secondary">
            Engineering
          </ButtonLink>
          <ButtonLink href="/stem/mathematics" variant="secondary">
            Mathematics
          </ButtonLink>
          <ButtonLink href="/resources" variant="primary">
            All activities
          </ButtonLink>
        </EmptyState>
      </div>
    )
  }

  const subjectIds = resolveSubjectIdsForStem(meta, subjects)
  const subjectOptions = subjects.filter((s) => meta.subjects.includes(s.name))

  const misconfigured = meta.subjects.length > 0 && subjectIds.length === 0

  const resources = misconfigured
    ? []
    : await getPublicResources({
        q: q || undefined,
        grade: grade || undefined,
        subject: subject || undefined,
        subjectIds: subjectIds.length ? subjectIds : undefined,
        print_required: print_required ? print_required === 'true' : undefined,
        extra_materials_required: extra_materials_required
          ? extra_materials_required === 'true'
          : undefined,
      })

  const defaults = {
    q,
    grade,
    subject,
    print_required: print_required ?? '',
    extra_materials_required: extra_materials_required ?? '',
  }

  const emptyCopy = getStemCategoryEmptyCopy(category)

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow={`STEM · ${meta.letter}`}
        title={meta.title}
        description={meta.studentDescription}
        icon={HeaderIcon}
        actions={
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 underline-offset-4 hover:underline"
          >
            All activities
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        {meta.subjects.map((name) => (
          <Badge key={name} variant="subject">
            {name}
          </Badge>
        ))}
      </div>

      <PublicResourceFilterForm
        action={`/stem/${category}`}
        gradeLevels={gradeLevels}
        subjects={subjectOptions}
        defaults={defaults}
        idPrefix={`stem-${category}`}
        showSubjectFilter={meta.subjects.length > 1}
      />

      {misconfigured ? (
        <EmptyState
          icon={Atom}
          title="No activities found yet"
          description="Subjects for this category are not linked in the database. Ask an admin to verify subject names match your STEM mapping."
        />
      ) : resources.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} subjectNamesInCategory={meta.subjects} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title={emptyCopy.title} description={emptyCopy.description}>
          <ButtonLink href="/resources" variant="secondary">
            Browse all activities
          </ButtonLink>
          <ButtonLink href="/subjects" variant="ghost">
            Choose another pathway
          </ButtonLink>
        </EmptyState>
      )}
    </div>
  )
}
