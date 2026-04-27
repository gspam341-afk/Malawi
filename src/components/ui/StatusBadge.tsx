export function StatusBadge({
  status,
}: {
  status: 'published' | 'draft' | 'pending' | string
}) {
  const styles =
    status === 'published'
      ? 'bg-emerald-50 text-emerald-900 ring-emerald-600/20'
      : status === 'pending'
        ? 'bg-amber-50 text-amber-900 ring-amber-600/20'
        : status === 'draft'
          ? 'bg-slate-100 text-slate-800 ring-slate-600/15'
          : 'bg-slate-100 text-slate-800 ring-slate-600/15'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status}
    </span>
  )
}
