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

export function PublicResourceFilterForm({
  action,
  gradeLevels,
  subjects,
  defaults,
  idPrefix = 'filter',
}: {
  action: string
  gradeLevels: Grade[]
  subjects: Subject[]
  defaults: Defaults
  idPrefix?: string
}) {
  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6"
      method="get"
      action={action}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 lg:col-span-6 lg:border-0 lg:pb-0">
        <SlidersHorizontal className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
        <span className="text-sm font-semibold text-slate-900">Filters</span>
      </div>

      <div className="sm:col-span-2 lg:col-span-2">
        <label
          htmlFor={`${idPrefix}-q`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Search
        </label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          defaultValue={defaults.q}
          placeholder="Title, description, or outcome"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-grade`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          <Bookmark className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Grade level
        </label>
        <select
          id={`${idPrefix}-grade`}
          name="grade"
          defaultValue={defaults.grade}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">All grades</option>
          {gradeLevels.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-subject`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          <Filter className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Subject
        </label>
        <select
          id={`${idPrefix}-subject`}
          name="subject"
          defaultValue={defaults.subject}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">All in category</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-print`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          <Printer className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Printable
        </label>
        <select
          id={`${idPrefix}-print`}
          name="print_required"
          defaultValue={defaults.print_required}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">Any</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-extra`}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          <Puzzle className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          Extra materials
        </label>
        <select
          id={`${idPrefix}-extra`}
          name="extra_materials_required"
          defaultValue={defaults.extra_materials_required}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        >
          <option value="">Any</option>
          <option value="true">Required</option>
          <option value="false">Not required</option>
        </select>
      </div>

      <div className="flex items-end lg:col-span-6">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"
        >
          <ListFilter className="h-4 w-4" aria-hidden />
          Apply filters
        </button>
      </div>
    </form>
  )
}
