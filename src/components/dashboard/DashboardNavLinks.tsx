import Link from 'next/link'
import type { NavSection } from '@/components/dashboard/navConfig'

export function DashboardNavLinks({ sections }: { sections: NavSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="border-t border-slate-100 pt-4">
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
        >
          ← Public site
        </Link>
      </div>
    </div>
  )
}
