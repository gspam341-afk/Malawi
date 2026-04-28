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
      className={`group flex gap-4 rounded-jac-lg border border-jac-navy/10 bg-white p-5 shadow-jac-soft transition hover:border-jac-purple/30 hover:shadow-jac-medium hover:shadow-jac-navy/5 ${dashFocusRing}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-jac-md bg-gradient-to-br from-jac-purple/15 to-jac-offwhite text-jac-purple ring-1 ring-jac-purple/15 [&_svg]:h-6 [&_svg]:w-6">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-semibold text-jac-navy">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-jac-navy/65">{description}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-jac-purple group-hover:text-[#6240b8]">
          Open
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  )
}
