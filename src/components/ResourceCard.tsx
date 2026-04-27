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

export function ResourceCard({ resource }: { resource: ResourceListItem }) {
  const gradeBadges = resource.grade_levels?.length
    ? resource.grade_levels.slice().sort((a, b) => a.grade_number - b.grade_number)
    : []

  const materialsLine = materialsSummary(resource.required_materials ?? [])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        {resource.print_required ? (
          <Badge variant="stem">
            Printable
          </Badge>
        ) : null}
        {!resource.extra_materials_required ? (
          <Badge variant="outline">No extra materials</Badge>
        ) : null}
        {resource.cutting_required ? <Badge variant="neutral">Cutting required</Badge> : null}
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
            {g.name}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {resource.subjects?.length
          ? resource.subjects.map((s) => (
              <Badge key={s.id} variant="subject">
                {s.name}
              </Badge>
            ))
          : null}
      </div>

      <div className="mt-4 grid gap-1 border-t border-slate-100 pt-4 text-sm text-slate-600">
        {resource.activity_duration ? (
          <div>
            <span className="font-medium text-slate-800">Duration:</span> {resource.activity_duration}
          </div>
        ) : null}
        {materialsLine ? (
          <div>
            <span className="font-medium text-slate-800">Materials:</span> {materialsLine}
          </div>
        ) : resource.extra_materials_required ? (
          <div className="text-slate-500">Materials listed on the activity page.</div>
        ) : (
          <div className="text-slate-500">No extra materials listed.</div>
        )}
      </div>

      <div className="mt-auto pt-5">
        <ButtonLink href={`/resources/${resource.id}`} variant="accent" className="w-full sm:w-auto">
          View activity
        </ButtonLink>
      </div>
    </div>
  )
}
