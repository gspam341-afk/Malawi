import {
  Archive,
  CheckCircle2,
  CircleDot,
  Eye,
  FilePenLine,
  Globe,
  Lock,
  Tags,
  UserCircle,
  XCircle,
} from 'lucide-react'
import type { ResourceStatus } from '@/types/db'

type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived'
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested'

const pill = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset'

export function ResourceStatusBadge({ status }: { status: ResourceStatus | string }) {
  const map: Record<string, { className: string; Icon: typeof CircleDot }> = {
    draft: { className: `${pill} bg-slate-100 text-slate-800 ring-slate-400/25`, Icon: FilePenLine },
    pending: { className: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`, Icon: CircleDot },
    published: { className: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/30`, Icon: CheckCircle2 },
    rejected: { className: `${pill} bg-red-50 text-red-900 ring-red-400/30`, Icon: XCircle },
    archived: { className: `${pill} bg-slate-50 text-slate-700 ring-slate-300`, Icon: Archive },
  }
  const entry = map[status] ?? { className: `${pill} bg-slate-100 text-slate-800`, Icon: CircleDot }
  const Icon = entry.Icon
  return (
    <span className={entry.className}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {status}
    </span>
  )
}

export function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, { className: string; Icon: typeof Globe }> = {
    public: { className: `${pill} bg-sky-50 text-sky-900 ring-sky-400/30`, Icon: Globe },
    teacher_only: { className: `${pill} bg-indigo-50 text-indigo-900 ring-indigo-400/25`, Icon: UserCircle },
    logged_in_only: { className: `${pill} bg-blue-50 text-blue-900 ring-blue-400/25`, Icon: Eye },
    private: { className: `${pill} bg-slate-100 text-slate-800 ring-slate-400/25`, Icon: Lock },
  }
  const entry = map[visibility] ?? { className: `${pill} bg-slate-100`, Icon: Eye }
  const Icon = entry.Icon
  return (
    <span className={entry.className}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {visibility}
    </span>
  )
}

export function BlogStatusBadge({ status }: { status: BlogStatus | string }) {
  return <ResourceStatusBadge status={status} />
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus | string }) {
  const map: Record<string, { className: string; Icon: typeof CircleDot }> = {
    pending: { className: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`, Icon: CircleDot },
    approved: { className: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/30`, Icon: CheckCircle2 },
    rejected: { className: `${pill} bg-red-50 text-red-900 ring-red-400/30`, Icon: XCircle },
    changes_requested: { className: `${pill} bg-orange-50 text-orange-900 ring-orange-400/30`, Icon: CircleDot },
  }
  const entry = map[status] ?? { className: `${pill} bg-slate-100`, Icon: CircleDot }
  const Icon = entry.Icon
  const label = typeof status === 'string' ? status.replace(/_/g, ' ') : status
  return (
    <span className={entry.className}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {label}
    </span>
  )
}

export function SubmissionTypeBadge({ type }: { type: string }) {
  return (
    <span className={`${pill} bg-teal-50 text-teal-900 ring-teal-400/25`}>
      <Tags className="h-3 w-3 shrink-0" aria-hidden />
      {type.replace(/_/g, ' ')}
    </span>
  )
}

export function UserStatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; Icon: typeof CheckCircle2 }> = {
    active: { className: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/25`, Icon: CheckCircle2 },
    pending: { className: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`, Icon: CircleDot },
    inactive: { className: `${pill} bg-slate-100 text-slate-700 ring-slate-400/25`, Icon: CircleDot },
    banned: { className: `${pill} bg-red-50 text-red-900 ring-red-400/30`, Icon: XCircle },
  }
  const entry = map[status] ?? { className: `${pill} bg-slate-100`, Icon: CircleDot }
  const Icon = entry.Icon
  return (
    <span className={entry.className}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {status}
    </span>
  )
}
