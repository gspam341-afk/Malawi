import type { Tables } from '@/types/db'
import {
  Bookmark,
  Filter,
  ListFilter,
  Printer,
  Puzzle,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

type Grade = Tables['grade_levels']['Row']
type Subject = Tables['subjects']['Row']

type Defaults = {
  q: string
  grade: string
  subject: string
  print_required: string
  extra_materials_required: string
}

const inputClass =
  'mt-1 w-full rounded-jac-md border border-jac-navy/15 bg-white px-3 py-2 text-sm text-jac-navy shadow-jac-soft outline-none transition placeholder:text-jac-navy/45 focus:border-jac-purple focus:ring-2 focus:ring-jac-purple/25'

export function PublicResourceFilterForm({
  action,
  gradeLevels,
  subjects,
  defaults,
  idPrefix = 'filter',
  showSubjectFilter = true,
}: {
  action: string
  gradeLevels: Grade[]
  subjects: Subject[]
  defaults: Defaults
  idPrefix?: string
  /** Hide when the page scope only has one subject (e.g. Mathematics pathway). */
  showSubjectFilter?: boolean
}) {
  return (
    <form className="grid gap-4 rounded-jac-lg border border-jac-purple/12 bg-white p-5 shadow-jac-soft sm:grid-cols-2 lg:grid-cols-6 md:p-6" method="get" action={action}>
      <div className="flex items-center gap-2 border-b border-jac-purple/10 pb-3 lg:col-span-6 lg:border-0 lg:pb-0">
        <SlidersHorizontal className="h-5 w-5 shrink-0 text-jac-purple" aria-hidden />
        <span className="text-sm font-semibold text-jac-navy">Filters</span>
      </div>

      <div className="sm:col-span-2 lg:col-span-2">
        <label
          htmlFor={`${idPrefix}-q`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-navy/55"
        >
          <Search className="h-3.5 w-3.5 text-jac-purple/70" aria-hidden />
          Search
        </label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          defaultValue={defaults.q}
          placeholder="Title, description, or outcome"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-grade`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-navy/55"
        >
          <Bookmark className="h-3.5 w-3.5 text-jac-purple/70" aria-hidden />
          Grade level
        </label>
        <select id={`${idPrefix}-grade`} name="grade" defaultValue={defaults.grade} className={inputClass}>
          <option value="">All grades</option>
          {gradeLevels.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {showSubjectFilter ? (
        <div>
          <label
            htmlFor={`${idPrefix}-subject`}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-navy/55"
          >
            <Filter className="h-3.5 w-3.5 text-jac-purple/70" aria-hidden />
            Subject
          </label>
          <select id={`${idPrefix}-subject`} name="subject" defaultValue={defaults.subject} className={inputClass}>
            <option value="">All in category</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label
          htmlFor={`${idPrefix}-print`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-navy/55"
        >
          <Printer className="h-3.5 w-3.5 text-jac-purple/70" aria-hidden />
          Printable
        </label>
        <select id={`${idPrefix}-print`} name="print_required" defaultValue={defaults.print_required} className={inputClass}>
          <option value="">Any</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-extra`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jac-navy/55"
        >
          <Puzzle className="h-3.5 w-3.5 text-jac-purple/70" aria-hidden />
          Extra materials
        </label>
        <select
          id={`${idPrefix}-extra`}
          name="extra_materials_required"
          defaultValue={defaults.extra_materials_required}
          className={inputClass}
        >
          <option value="">Any</option>
          <option value="true">Required</option>
          <option value="false">Not required</option>
        </select>
      </div>

      <div className="flex items-end lg:col-span-6">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-jac-purple px-5 py-2.5 text-sm font-medium text-white shadow-jac-soft transition hover:bg-[#6240b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 sm:w-auto"
        >
          <ListFilter className="h-4 w-4" aria-hidden />
          Apply filters
        </button>
      </div>
    </form>
  )
}
