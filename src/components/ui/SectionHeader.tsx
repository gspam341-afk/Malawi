import Link from 'next/link'
import { type ReactNode } from 'react'

export function SectionHeader({
  title,
  subtitle,
  linkHref,
  linkLabel,
  action,
}: {
  title: string
  subtitle?: string
  linkHref?: string
  linkLabel?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
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
