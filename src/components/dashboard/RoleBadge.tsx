import { GraduationCap, HeartHandshake, Shield, User } from 'lucide-react'
import type { ProfileRole } from '@/types/db'

function label(role: ProfileRole): string {
  switch (role) {
    case 'admin':
      return 'Platform manager'
    case 'teacher':
      return 'Content creator'
    case 'alumni':
    case 'donor':
      return 'Contributor'
    case 'student_optional':
      return 'Optional student'
    default:
      return role
  }
}

const styles: Record<ProfileRole, string> = {
  admin: 'bg-violet-100 text-violet-900 ring-violet-400/30',
  teacher: 'bg-teal-100 text-teal-900 ring-teal-500/25',
  alumni: 'bg-amber-100 text-amber-900 ring-amber-400/30',
  donor: 'bg-amber-100 text-amber-900 ring-amber-400/30',
  student_optional: 'bg-slate-100 text-slate-800 ring-slate-400/25',
}

const RoleIcon = {
  admin: Shield,
  teacher: GraduationCap,
  alumni: HeartHandshake,
  donor: HeartHandshake,
  student_optional: User,
} as const satisfies Record<ProfileRole, typeof Shield>

export function RoleBadge({ role }: { role: ProfileRole }) {
  const Icon = RoleIcon[role]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[role]}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
      {label(role)}
    </span>
  )
}
