import Link from 'next/link'
import { type ReactNode } from 'react'
import { dashFocusRing } from '@/components/dashboard/classes'

export function DashboardNavCard({
  href,
  title,
  description,
  marker,
}: {
  href: string
  title: string
  description: string
  marker: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:border-teal-200 hover:shadow-md hover:shadow-teal-900/5 ${dashFocusRing}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-amber-50 text-xl ring-1 ring-teal-600/10">
        {marker}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-slate-600">{description}</span>
        <span className="mt-3 inline-flex text-sm font-medium text-teal-700 group-hover:text-teal-900">
          Open →
        </span>
      </span>
    </Link>
  )
}
