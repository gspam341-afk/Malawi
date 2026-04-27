export type StemSlug = 'science' | 'technology' | 'engineering' | 'mathematics'

export type StemCategoryMeta = {
  slug: StemSlug
  letter: string
  title: string
  description: string
  subjectNames: string[]
  comingSoon?: boolean
}

export const STEM_CATEGORY_LIST: StemCategoryMeta[] = [
  {
    slug: 'science',
    letter: 'S',
    title: 'Science',
    subjectNames: ['Physics', 'Chemistry', 'Biology'],
    description: 'Explore physical activities for Physics, Chemistry and Biology.',
  },
  {
    slug: 'technology',
    letter: 'T',
    title: 'Technology',
    subjectNames: [],
    description: 'Technology activities will be added later.',
    comingSoon: true,
  },
  {
    slug: 'engineering',
    letter: 'E',
    title: 'Engineering',
    subjectNames: ['Agriculture'],
    description:
      'Hands-on Agriculture activities connected to real-world systems and production.',
  },
  {
    slug: 'mathematics',
    letter: 'M',
    title: 'Mathematics',
    subjectNames: ['Mathematics'],
    description: 'Printable and physical activities for mathematical thinking and practice.',
  },
]

export const STEM_CATEGORIES: Record<StemSlug, StemCategoryMeta> = {
  science: STEM_CATEGORY_LIST[0],
  technology: STEM_CATEGORY_LIST[1],
  engineering: STEM_CATEGORY_LIST[2],
  mathematics: STEM_CATEGORY_LIST[3],
}

export function isStemSlug(value: string): value is StemSlug {
  return value in STEM_CATEGORIES
}

export function resolveSubjectIdsForStem(
  meta: StemCategoryMeta,
  subjects: { id: string; name: string }[],
): string[] {
  if (meta.comingSoon || !meta.subjectNames.length) return []
  const byName = new Map(subjects.map((s) => [s.name, s.id]))
  return meta.subjectNames.map((n) => byName.get(n)).filter((id): id is string => Boolean(id))
}
