import Link from 'next/link'
import { ArrowRight, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { getStemCategories } from '@/lib/stemCategories'
import { StemCategoryIcon } from '@/components/stem/StemCategoryIcon'

export function StemPathwayGrid() {
  const categories = getStemCategories()

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {categories.map((cat) => {
        const href = `/stem/${cat.slug}`
        return (
          <Link
            key={cat.slug}
            href={href}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Card
              className="h-full min-h-[220px] border-slate-200/90 transition group-hover:border-emerald-300 group-hover:shadow-lg group-hover:shadow-emerald-900/5"
              padding="p-6 md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-900 ring-1 ring-emerald-600/15">
                  <StemCategoryIcon slug={cat.slug} className="h-8 w-8" />
                </span>
                {cat.comingSoon ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-600/20">
                    <Cpu className="h-3.5 w-3.5" aria-hidden />
                    Coming soon
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{cat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{cat.description}</p>
              {cat.subjects.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.subjects.map((n) => (
                    <span
                      key={n}
                      className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900 ring-1 ring-sky-600/15"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Pathway opening soon.</p>
              )}
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 group-hover:underline">
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
