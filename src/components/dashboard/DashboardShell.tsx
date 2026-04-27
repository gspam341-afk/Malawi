import { ChevronDown } from 'lucide-react'
import type { Tables } from '@/types/db'
import { getDashboardNav } from '@/components/dashboard/navConfig'
import { DashboardNavLinks } from '@/components/dashboard/DashboardNavLinks'

export function DashboardShell({
  profile,
  children,
}: {
  profile: Tables['profiles']['Row']
  children: React.ReactNode
}) {
  const sections = getDashboardNav(profile.role)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <aside className="hidden shrink-0 lg:block lg:w-56 xl:w-60">
        <nav className="sticky top-24 space-y-2 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-teal-50/30 p-4 shadow-md shadow-slate-200/50 ring-1 ring-white/80">
          <DashboardNavLinks sections={sections} />
        </nav>
      </aside>

      <details className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Dashboard menu
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" aria-hidden />
          </span>
        </summary>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <DashboardNavLinks sections={sections} />
        </div>
      </details>

      <div className="min-w-0 flex-1 pb-12">{children}</div>
    </div>
  )
}
