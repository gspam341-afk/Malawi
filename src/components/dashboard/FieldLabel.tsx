import { type ReactNode } from 'react'

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="grid gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">
        {children}
      </label>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
