import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { type ReactNode } from 'react'
import { dashFocusRing } from '@/components/dashboard/classes'

export function DashboardNavCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:border-teal-200 hover:shadow-md hover:shadow-teal-900/5 ${dashFocusRing}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-amber-50 text-teal-800 ring-1 ring-teal-600/10 [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-slate-600">{description}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-900">
          Open
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  )
}
