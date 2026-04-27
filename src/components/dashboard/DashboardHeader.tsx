import Link from 'next/link'
import { type ReactNode } from 'react'
import { dashEyebrow, dashMuted, dashTitle } from '@/components/dashboard/classes'

export function DashboardHeader({
  eyebrow,
  title,
  description,
  rightSlot,
}: {
  eyebrow?: string
  title: string
  description?: string
  rightSlot?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-8">
      <div className="max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex text-sm font-medium text-teal-800 underline-offset-4 hover:text-teal-950 hover:underline"
        >
          ← Dashboard home
        </Link>
        {eyebrow ? <p className={`mt-4 ${dashEyebrow}`}>{eyebrow}</p> : null}
        <h1 className={`mt-2 ${dashTitle}`}>{title}</h1>
        {description ? <p className={`mt-3 ${dashMuted}`}>{description}</p> : null}
      </div>
      {rightSlot ? <div className="flex shrink-0 flex-wrap gap-2">{rightSlot}</div> : null}
    </header>
  )
}
