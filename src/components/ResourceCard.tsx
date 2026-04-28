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
import { subjectBadgeVariant } from '@/lib/subjectBadgeVariant'
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
    <div className="flex h-full flex-col rounded-jac-lg border-[length:var(--border-thin)] border-jac-purple/12 bg-white p-6 shadow-jac-soft transition hover:border-jac-purple/25 hover:shadow-jac-medium md:p-8">
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
          <Badge variant="neutral">
            <span className="inline-flex items-center gap-1">
              <PackageCheck className="h-3 w-3" aria-hidden />
              No extra materials
            </span>
          </Badge>
        ) : null}
        {resource.cutting_required ? (
          <Badge variant="outline">
            <span className="inline-flex items-center gap-1">
              <Scissors className="h-3 w-3" aria-hidden />
              Cutting required
            </span>
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-4 text-h4 font-semibold text-jac-navy">{resource.title}</h3>

      {resource.result_description ? (
        <p className="mt-3 text-body line-clamp-4">{resource.result_description}</p>
      ) : (
        <p className="mt-3 text-xs text-jac-navy/50 md:text-sm">No outcome summary yet.</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {gradeBadges.map((g) => (
          <Badge key={g.id} variant="neutral">
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
              <Badge key={s.id} variant={subjectBadgeVariant(s.name)}>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" aria-hidden />
                  {s.name}
                </span>
              </Badge>
            ))
          : null}
      </div>

      <div className="mt-5 grid gap-2 border-t border-jac-purple/10 pt-5 text-body">
        {resource.activity_duration ? (
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-jac-purple" aria-hidden />
            <span>
              <span className="font-medium text-jac-navy">Duration:</span> {resource.activity_duration}
            </span>
          </div>
        ) : null}
        {resource.group_size_min != null || resource.group_size_max != null ? (
          <div className="inline-flex items-center gap-2">
            <UsersRound className="h-4 w-4 shrink-0 text-jac-purple" aria-hidden />
            <span>
              <span className="font-medium text-jac-navy">Group size:</span>{' '}
              {resource.group_size_min ?? '—'}–{resource.group_size_max ?? '—'}
            </span>
          </div>
        ) : null}
        {materialsLine ? (
          <div className="inline-flex items-start gap-2">
            <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-jac-green" aria-hidden />
            <span>
              <span className="font-medium text-jac-navy">Materials:</span> {materialsLine}
            </span>
          </div>
        ) : resource.extra_materials_required ? (
          <div className="text-jac-navy/65">Materials listed on the activity page.</div>
        ) : (
          <div className="text-jac-navy/65">No extra materials listed.</div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <ButtonLink href={`/resources/${resource.id}`} variant="primary" iconRight={ArrowRight} className="w-full sm:w-auto">
          View activity
        </ButtonLink>
      </div>
    </div>
  )
}
