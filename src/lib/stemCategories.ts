export type StemSlug = 'science' | 'technology' | 'engineering' | 'mathematics'

export type StemCategoryMeta = {
  slug: StemSlug
  letter: string
  title: string
  /** Subject names in the database that belong to this STEM pathway (resource_subjects → subjects.name) */
  subjects: string[]
  description: string
  studentDescription: string
  comingSoon?: boolean
}

export const STEM_CATEGORIES: Record<StemSlug, StemCategoryMeta> = {
  science: {
    slug: 'science',
    letter: 'S',
    title: 'Science',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    description: 'Explore Physics, Chemistry and Biology through practical activities.',
    studentDescription:
      'Discover how the natural world works through experiments, movement and classroom challenges.',
    comingSoon: false,
  },
  technology: {
    slug: 'technology',
    letter: 'T',
    title: 'Technology',
    subjects: [],
    description: 'Technology activities are planned for a future version.',
    studentDescription: 'Technology activities will be added later.',
    comingSoon: true,
  },
  engineering: {
    slug: 'engineering',
    letter: 'E',
    title: 'Engineering',
    subjects: ['Agriculture'],
    description: 'Explore Agriculture through hands-on activities connected to real-world systems.',
    studentDescription: 'See how systems, production, nature and problem-solving connect.',
    comingSoon: false,
  },
  mathematics: {
    slug: 'mathematics',
    letter: 'M',
    title: 'Mathematics',
    subjects: ['Mathematics'],
    description: 'Explore Mathematics through printable, physical and problem-solving activities.',
    studentDescription: 'Practice patterns, numbers and problem-solving through active learning.',
    comingSoon: false,
  },
}

const STEM_CATEGORY_ORDER: StemSlug[] = ['science', 'technology', 'engineering', 'mathematics']

export function getStemCategories(): StemCategoryMeta[] {
  return STEM_CATEGORY_ORDER.map((slug) => STEM_CATEGORIES[slug])
}

export function getStemCategory(slug: string): StemCategoryMeta | undefined {
  if (!isStemSlug(slug)) return undefined
  return STEM_CATEGORIES[slug]
}

export function getStemCategorySubjectNames(slug: string): string[] {
  return getStemCategory(slug)?.subjects ?? []
}

export function isStemSlug(value: string): value is StemSlug {
  return value in STEM_CATEGORIES
}

export function resolveSubjectIdsForStem(
  meta: StemCategoryMeta,
  subjects: { id: string; name: string }[],
): string[] {
  if (meta.comingSoon || !meta.subjects.length) return []
  const byName = new Map(subjects.map((s) => [s.name, s.id]))
  return meta.subjects.map((n) => byName.get(n)).filter((id): id is string => Boolean(id))
}

/** Same as `getStemCategories()`; kept for existing imports. */
export const STEM_CATEGORY_LIST: StemCategoryMeta[] = getStemCategories()

export function getStemCategoryEmptyCopy(slug: StemSlug): { title: string; description: string } {
  switch (slug) {
    case 'science':
      return {
        title: 'No Science activities found yet',
        description: 'Try another grade level or check back later.',
      }
    case 'engineering':
      return {
        title: 'No Agriculture activities found yet',
        description: 'Try another grade level, adjust filters or check back later.',
      }
    case 'mathematics':
      return {
        title: 'No Mathematics activities found yet',
        description: 'Try another grade level or check back later.',
      }
    default:
      return {
        title: 'No activities found',
        description: 'Try changing filters or browse all activities.',
      }
  }
}
