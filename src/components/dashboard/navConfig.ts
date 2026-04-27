import type { ProfileRole } from '@/types/db'

export type NavItem = { href: string; label: string }
export type NavSection = { title: string; items: NavItem[] }

export function getDashboardNav(role: ProfileRole): NavSection[] {
  const account: NavSection = {
    title: 'Account',
    items: [{ href: '/dashboard/account', label: 'Settings' }],
  }

  if (role === 'admin') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home' }] },
      {
        title: 'Platform management',
        items: [
          { href: '/dashboard/users', label: 'User management' },
          { href: '/dashboard/users/invite-teacher', label: 'Invite teacher' },
          { href: '/dashboard/resources/manage', label: 'Manage resources' },
          { href: '/dashboard/blog-posts', label: 'Blog posts' },
          { href: '/dashboard/submissions', label: 'Submissions' },
          { href: '/dashboard/subjects', label: 'Subjects' },
          { href: '/dashboard/grade-levels', label: 'Grade levels' },
        ],
      },
      account,
    ]
  }

  if (role === 'teacher') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home' }] },
      {
        title: 'Content tools',
        items: [
          { href: '/dashboard/resources', label: 'My resources' },
          { href: '/dashboard/resources/new', label: 'Create resource' },
          { href: '/dashboard/blog-posts', label: 'Blog posts' },
          { href: '/dashboard/submissions', label: 'Submissions' },
        ],
      },
      account,
    ]
  }

  if (role === 'alumni' || role === 'donor') {
    return [
      { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home' }] },
      {
        title: 'Content',
        items: [
          { href: '/dashboard/blog-posts', label: 'My blog posts' },
          { href: '/dashboard/submissions/new', label: 'Submit activity idea' },
          { href: '/dashboard/submissions', label: 'My submissions' },
        ],
      },
      account,
    ]
  }

  return [{ title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard home' }] }, account]
}
