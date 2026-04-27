import type { LucideIcon } from 'lucide-react'
import {
  Atom,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  Lightbulb,
  Newspaper,
  PenLine,
  PlusCircle,
  Send,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react'
import type { ProfileRole } from '@/types/db'

export type NavItem = { href: string; label: string; Icon: LucideIcon }
export type NavSection = { title: string; items: NavItem[] }

export function getDashboardNav(role: ProfileRole): NavSection[] {
  const account: NavSection = {
    title: 'Account',
    items: [{ href: '/dashboard/account', label: 'Settings', Icon: Settings }],
  }

  if (role === 'admin') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home', Icon: LayoutDashboard }] },
      {
        title: 'Platform management',
        items: [
          { href: '/dashboard/users', label: 'User management', Icon: Users },
          { href: '/dashboard/users/invite-teacher', label: 'Invite teacher', Icon: UserPlus },
          { href: '/dashboard/resources/manage', label: 'Manage resources', Icon: LibraryBig },
          { href: '/dashboard/blog-posts', label: 'Blog posts', Icon: Newspaper },
          { href: '/dashboard/submissions', label: 'Submissions', Icon: Inbox },
          { href: '/dashboard/subjects', label: 'Subjects', Icon: Atom },
          { href: '/dashboard/grade-levels', label: 'Grade levels', Icon: GraduationCap },
        ],
      },
      account,
    ]
  }

  if (role === 'teacher') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home', Icon: LayoutDashboard }] },
      {
        title: 'Content tools',
        items: [
          { href: '/dashboard/resources', label: 'My resources', Icon: LibraryBig },
          { href: '/dashboard/resources/new', label: 'Create resource', Icon: PlusCircle },
          { href: '/dashboard/blog-posts', label: 'Blog posts', Icon: PenLine },
          { href: '/dashboard/submissions', label: 'Submissions', Icon: Send },
        ],
      },
      account,
    ]
  }

  if (role === 'alumni' || role === 'donor') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home', Icon: LayoutDashboard }] },
      {
        title: 'Content',
        items: [
          { href: '/dashboard/blog-posts', label: 'My blog posts', Icon: PenLine },
          { href: '/dashboard/submissions/new', label: 'Submit activity idea', Icon: Lightbulb },
          { href: '/dashboard/submissions', label: 'My submissions', Icon: Inbox },
        ],
      },
      account,
    ]
  }

  return [{ title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home', Icon: LayoutDashboard }] }, account]
}
