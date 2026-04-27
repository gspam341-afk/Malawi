import { type ReactNode } from 'react'

export function TableShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/40 ${className}`}
    >
      {children}
    </div>
  )
}

export function TableTitleRow({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/80 via-white to-amber-50/50">
      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</tr>
    </thead>
  )
}
