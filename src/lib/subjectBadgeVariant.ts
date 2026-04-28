import type { BadgeVariant } from '@/components/ui/Badge'

/** Subject-tinted badge variant for Jacaranda mapping. */
export function subjectBadgeVariant(subjectName: string): BadgeVariant {
  switch (subjectName) {
    case 'Mathematics':
      return 'orange'
    case 'Biology':
    case 'Agriculture':
      return 'stem'
    case 'Physics':
    case 'Chemistry':
      return 'purple'
    default:
      return 'subject'
  }
}
