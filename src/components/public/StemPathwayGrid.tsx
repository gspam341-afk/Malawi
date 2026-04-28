import Link from 'next/link'
import { ArrowRight, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { StemSlug } from '@/lib/stemCategories'
import { getStemCategories } from '@/lib/stemCategories'
import { StemCategoryIcon } from '@/components/stem/StemCategoryIcon'

const STEM_CARD_VISUAL: Record<
  StemSlug,
  {
    blobs: [string, string]
    iconWrap: string
    chip: string
    cta: string
    cardHover: string
  }
> = {
  science: {
    blobs: ['jac-blob bg-jac-purple/25 right-0 top-0 h-28 w-28 translate-x-1/4 -translate-y-1/4', 'jac-blob bg-jac-pink/35 bottom-0 left-0 h-24 w-24 -translate-x-1/4 translate-y-1/4'],
    iconWrap:
      'bg-gradient-to-br from-jac-purple/25 to-jac-blue/15 text-jac-purple ring-[length:var(--border-thin)] ring-jac-purple/25',
    chip: 'rounded-full bg-jac-purple/12 px-2.5 py-1 text-xs font-medium text-jac-purple ring-1 ring-jac-purple/20',
    cta: 'text-jac-purple group-hover:underline',
    cardHover: 'hover:border-jac-purple/35 hover:shadow-jac-medium',
  },
  technology: {
    blobs: ['jac-blob bg-jac-blue/25 right-2 top-2 h-28 w-28', 'jac-blob bg-jac-purple/15 bottom-2 left-0 h-24 w-24'],
    iconWrap:
      'bg-gradient-to-br from-jac-blue/25 to-jac-purple/10 text-jac-blue ring-[length:var(--border-thin)] ring-jac-blue/25',
    chip: 'rounded-full bg-jac-orange/15 px-2.5 py-1 text-xs font-semibold text-[#8a5200] ring-1 ring-jac-orange/35',
    cta: 'text-jac-blue group-hover:underline',
    cardHover: 'hover:border-jac-blue/35 hover:shadow-jac-medium',
  },
  engineering: {
    blobs: ['jac-blob bg-jac-green/25 -right-4 top-0 h-28 w-28', 'jac-blob bg-jac-orange/20 bottom-0 left-0 h-24 w-24'],
    iconWrap:
      'bg-gradient-to-br from-jac-green/25 to-jac-orange/15 text-jac-green ring-[length:var(--border-thin)] ring-jac-green/30',
    chip: 'rounded-full bg-jac-green/12 px-2.5 py-1 text-xs font-medium text-jac-green ring-1 ring-jac-green/25',
    cta: 'text-jac-green group-hover:underline',
    cardHover: 'hover:border-jac-green/35 hover:shadow-jac-medium',
  },
  mathematics: {
    blobs: ['jac-blob bg-jac-orange/30 -right-2 top-4 h-24 w-24', 'jac-blob bg-jac-purple/15 bottom-2 left-2 h-20 w-20'],
    iconWrap:
      'bg-gradient-to-br from-jac-orange/30 to-jac-purple/15 text-[#b37400] ring-[length:var(--border-thin)] ring-jac-orange/35',
    chip: 'rounded-full bg-jac-orange/15 px-2.5 py-1 text-xs font-medium text-[#8a5200] ring-1 ring-jac-orange/35',
    cta: 'text-[#b37400] group-hover:underline',
    cardHover: 'hover:border-jac-orange/40 hover:shadow-jac-medium',
  },
}

export function StemPathwayGrid() {
  const categories = getStemCategories()

  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 xl:gap-10">
      {categories.map((cat) => {
        const href = `/stem/${cat.slug}`
        const v = STEM_CARD_VISUAL[cat.slug]

        return (
          <Link
            key={cat.slug}
            href={href}
            className={`group relative block rounded-jac-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 focus-visible:ring-offset-jac-offwhite md:min-h-[280px]`}
          >
            <span className={`jac-blob ${v.blobs[0]}`} aria-hidden />
            <span className={`jac-blob ${v.blobs[1]}`} aria-hidden />

            <Card
              className={`relative h-full min-h-[240px] overflow-hidden border-2 border-jac-purple/18 bg-white shadow-[0_10px_36px_-10px_rgba(28,24,48,0.14)] transition ${v.cardHover} md:min-h-[260px]`}
              padding="p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-jac-lg bg-gradient-to-br shadow-jac-soft ${v.iconWrap}`}
                >
                  <StemCategoryIcon slug={cat.slug} className="h-9 w-9" />
                </span>
                {cat.comingSoon ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-jac-orange/15 px-2.5 py-1 text-xs font-semibold text-[#8a5200] ring-1 ring-jac-orange/35">
                    <Cpu className="h-3.5 w-3.5" aria-hidden />
                    Coming soon
                  </span>
                ) : null}
              </div>
              <h3 className="font-display mt-6 text-xl font-normal tracking-tight text-jac-navy md:text-2xl">{cat.title}</h3>
              <p className="mt-3 text-body text-jac-navy/[0.88]">{cat.description}</p>
              {cat.subjects.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {cat.subjects.map((n) => (
                    <span key={n} className={v.chip}>
                      {n}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-body text-jac-navy/60">Pathway opening soon.</p>
              )}
              <span className={`mt-8 inline-flex items-center gap-1 text-sm font-semibold ${v.cta}`}>
                {cat.comingSoon ? 'View Technology pathway' : `Explore ${cat.title}`}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
