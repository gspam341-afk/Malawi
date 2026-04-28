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
    <thead className="border-b border-jac-navy/10 bg-gradient-to-r from-jac-purple/[0.06] via-white to-jac-pink/12">
      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</tr>
    </thead>
  )
}
