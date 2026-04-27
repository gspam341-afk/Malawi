import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  PackageCheck,
  Printer,
  Scissors,
  UsersRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import type { ResourceListItem } from '@/types/db'

function materialsSummary(materials: { name: string; quantity: number | null }[]) {
  if (!materials?.length) return null
  return materials
    .slice(0, 4)
    .map((m) => (m.quantity ? `${m.quantity}× ${m.name}` : m.name))
    .join(', ')
}

export function ResourceCard({
  resource,
  subjectNamesInCategory,
}: {
  resource: ResourceListItem
  /** When set, only subject badges in this pathway are shown (STEM category lists). */
  subjectNamesInCategory?: string[]
}) {
  const gradeBadges = resource.grade_levels?.length
    ? resource.grade_levels.slice().sort((a, b) => a.grade_number - b.grade_number)
    : []

  const materialsLine = materialsSummary(resource.required_materials ?? [])

  const subjectBadges =
    resource.subjects?.filter((s) =>
      subjectNamesInCategory?.length ? subjectNamesInCategory.includes(s.name) : true,
    ) ?? []

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        {resource.print_required ? (
          <Badge variant="stem">
            <span className="inline-flex items-center gap-1">
              <Printer className="h-3 w-3" aria-hidden />
              Printable
            </span>
          </Badge>
        ) : null}
        {!resource.extra_materials_required ? (
          <Badge variant="outline">
            <span className="inline-flex items-center gap-1">
              <PackageCheck className="h-3 w-3" aria-hidden />
              No extra materials
            </span>
          </Badge>
        ) : null}
        {resource.cutting_required ? (
          <Badge variant="neutral">
            <span className="inline-flex items-center gap-1">
              <Scissors className="h-3 w-3" aria-hidden />
              Cutting required
            </span>
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">{resource.title}</h3>

      {resource.result_description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-4">{resource.result_description}</p>
      ) : (
        <p className="mt-2 text-sm text-slate-500">No outcome summary yet.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {gradeBadges.map((g) => (
          <Badge key={g.id} variant="outline">
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3 w-3" aria-hidden />
              {g.name}
            </span>
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {subjectBadges.length
          ? subjectBadges.map((s) => (
              <Badge key={s.id} variant="subject">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" aria-hidden />
                  {s.name}
                </span>
              </Badge>
            ))
          : null}
      </div>

      <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        {resource.activity_duration ? (
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            <span>
              <span className="font-medium text-slate-800">Duration:</span> {resource.activity_duration}
            </span>
          </div>
        ) : null}
        {resource.group_size_min != null || resource.group_size_max != null ? (
          <div className="inline-flex items-center gap-2">
            <UsersRound className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            <span>
              <span className="font-medium text-slate-800">Group size:</span>{' '}
              {resource.group_size_min ?? '—'}–{resource.group_size_max ?? '—'}
            </span>
          </div>
        ) : null}
        {materialsLine ? (
          <div className="inline-flex items-start gap-2">
            <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            <span>
              <span className="font-medium text-slate-800">Materials:</span> {materialsLine}
            </span>
          </div>
        ) : resource.extra_materials_required ? (
          <div className="text-slate-500">Materials listed on the activity page.</div>
        ) : (
          <div className="text-slate-500">No extra materials listed.</div>
        )}
      </div>

      <div className="mt-auto pt-5">
        <ButtonLink href={`/resources/${resource.id}`} variant="accent" iconRight={ArrowRight} className="w-full sm:w-auto">
          View activity
        </ButtonLink>
      </div>
    </div>
  )
}
