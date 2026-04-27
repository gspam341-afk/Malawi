import Link from 'next/link'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { dashEyebrow, dashMuted, dashTitle } from '@/components/dashboard/classes'

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  backHref = '/dashboard',
  backLabel = 'Dashboard home',
  titleIcon: TitleIcon,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  backHref?: string
  backLabel?: string
  titleIcon?: LucideIcon
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-800 underline-offset-4 hover:text-teal-950 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {backLabel}
        </Link>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          {TitleIcon ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-600/15">
              <TitleIcon className="h-7 w-7" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? <p className={dashEyebrow}>{eyebrow}</p> : null}
            <h1 className={`${dashTitle} ${eyebrow ? 'mt-2' : ''}`}>{title}</h1>
            {description ? <p className={`mt-3 ${dashMuted}`}>{description}</p> : null}
          </div>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
