import Link from 'next/link'
import { type ReactNode } from 'react'
import { dashEyebrow, dashMuted, dashTitle } from '@/components/dashboard/classes'

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  backHref = '/dashboard',
  backLabel = 'Dashboard home',
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <Link
          href={backHref}
          className="inline-flex text-sm font-medium text-teal-800 underline-offset-4 hover:text-teal-950 hover:underline"
        >
          ← {backLabel}
        </Link>
        {eyebrow ? <p className={`mt-3 ${dashEyebrow}`}>{eyebrow}</p> : null}
        <h1 className={`mt-2 ${dashTitle}`}>{title}</h1>
        {description ? <p className={`mt-3 ${dashMuted}`}>{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
