import Link from 'next/link'
import { Globe } from 'lucide-react'
import type { NavSection } from '@/components/dashboard/navConfig'

export function DashboardNavLinks({ sections }: { sections: NavSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-jac-navy/45">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.Icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-jac-md px-3 py-2 text-sm font-medium text-jac-navy/80 transition hover:bg-jac-purple/10 hover:text-jac-navy"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-jac-purple/90" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <div className="border-t border-jac-navy/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-jac-md px-3 py-2 text-sm font-medium text-jac-purple hover:bg-jac-purple/10"
        >
          <Globe className="h-4 w-4 shrink-0" aria-hidden />
          Public site
        </Link>
      </div>
    </div>
  )
}
