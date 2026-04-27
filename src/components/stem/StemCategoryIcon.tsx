import { Atom, Calculator, Cpu, Sprout, type LucideIcon, type LucideProps } from 'lucide-react'
import type { StemSlug } from '@/lib/stemCategories'

const iconBySlug: Record<StemSlug, LucideIcon> = {
  science: Atom,
  technology: Cpu,
  engineering: Sprout,
  mathematics: Calculator,
}

export function StemCategoryIcon({ slug, ...props }: { slug: StemSlug } & LucideProps) {
  const Icon = iconBySlug[slug]
  return <Icon aria-hidden {...props} />
}
