import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  icon: Icon,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-start gap-4">
          {Icon ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-600/15">
              <Icon className="h-7 w-7" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{eyebrow}</p>
            ) : null}
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
            {description ? <p className="mt-3 text-base text-slate-600">{description}</p> : null}
          </div>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
