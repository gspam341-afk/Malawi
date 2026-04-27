import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

export function SectionHeader({
  title,
  subtitle,
  linkHref,
  linkLabel,
  action,
  icon: Icon,
}: {
  title: string
  subtitle?: string
  linkHref?: string
  linkLabel?: string
  action?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-wrap items-start gap-3">
        {Icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/15">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {linkHref && linkLabel ? (
          <Link
            href={linkHref}
            className="text-sm font-medium text-emerald-800 underline-offset-4 hover:text-emerald-900 hover:underline"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
