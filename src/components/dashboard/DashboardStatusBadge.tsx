import type { ResourceStatus } from '@/types/db'

type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived'
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested'

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset'

export function ResourceStatusBadge({ status }: { status: ResourceStatus | string }) {
  const map: Record<string, string> = {
    draft: `${pill} bg-slate-100 text-slate-800 ring-slate-400/25`,
    pending: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`,
    published: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/30`,
    rejected: `${pill} bg-red-50 text-red-900 ring-red-400/30`,
    archived: `${pill} bg-slate-50 text-slate-700 ring-slate-300`,
  }
  return <span className={map[status] ?? `${pill} bg-slate-100 text-slate-800`}>{status}</span>
}

export function VisibilityBadge({ visibility }: { visibility: string }) {
  const map: Record<string, string> = {
    public: `${pill} bg-sky-50 text-sky-900 ring-sky-400/30`,
    teacher_only: `${pill} bg-indigo-50 text-indigo-900 ring-indigo-400/25`,
    logged_in_only: `${pill} bg-blue-50 text-blue-900 ring-blue-400/25`,
    private: `${pill} bg-slate-100 text-slate-800 ring-slate-400/25`,
  }
  return <span className={map[visibility] ?? `${pill} bg-slate-100`}>{visibility}</span>
}

export function BlogStatusBadge({ status }: { status: BlogStatus | string }) {
  return <ResourceStatusBadge status={status} />
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus | string }) {
  const map: Record<string, string> = {
    pending: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`,
    approved: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/30`,
    rejected: `${pill} bg-red-50 text-red-900 ring-red-400/30`,
    changes_requested: `${pill} bg-orange-50 text-orange-900 ring-orange-400/30`,
  }
  return <span className={map[status] ?? `${pill} bg-slate-100`}>{status}</span>
}

export function SubmissionTypeBadge({ type }: { type: string }) {
  return (
    <span className={`${pill} bg-teal-50 text-teal-900 ring-teal-400/25`}>{type.replace(/_/g, ' ')}</span>
  )
}

export function UserStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: `${pill} bg-emerald-50 text-emerald-900 ring-emerald-500/25`,
    pending: `${pill} bg-amber-50 text-amber-900 ring-amber-400/35`,
    inactive: `${pill} bg-slate-100 text-slate-700 ring-slate-400/25`,
    banned: `${pill} bg-red-50 text-red-900 ring-red-400/30`,
  }
  return <span className={map[status] ?? `${pill} bg-slate-100`}>{status}</span>
}
