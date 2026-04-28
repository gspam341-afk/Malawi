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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-jac-md bg-jac-purple/12 text-jac-purple ring-1 ring-jac-purple/15">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
        <div>
          <h2 className="text-h4 font-semibold text-jac-navy">{title}</h2>
          {subtitle ? <p className="mt-1 text-body">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {linkHref && linkLabel ? (
          <Link href={linkHref} className="text-link font-medium text-jac-blue">
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
