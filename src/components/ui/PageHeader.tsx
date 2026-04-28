import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  icon: Icon,
  displayTitle = false,
}: {
  title: string
  description?: ReactNode
  eyebrow?: string
  actions?: ReactNode
  icon?: LucideIcon
  /** Use Moul-style display heading (public STEM/category pages). */
  displayTitle?: boolean
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-start gap-4">
          {Icon ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-jac-md bg-jac-purple/12 text-jac-purple shadow-jac-soft ring-1 ring-jac-purple/15">
              <Icon className="h-7 w-7" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-jac-purple">{eyebrow}</p>
            ) : null}
            <h1
              className={
                displayTitle
                  ? eyebrow
                    ? 'text-h2 mt-2'
                    : 'text-h2'
                  : eyebrow
                    ? 'mt-2 text-3xl font-semibold tracking-tight text-jac-navy md:text-4xl'
                    : 'mt-1 text-3xl font-semibold tracking-tight text-jac-navy md:text-4xl'
              }
            >
              {title}
            </h1>
            {description ? <div className="mt-3 text-base text-jac-navy/75">{description}</div> : null}
          </div>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
