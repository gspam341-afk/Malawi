import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function BlogPage() {
  return (
    <div className="grid gap-6 pb-8">
      <div className="flex flex-wrap items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15">
          <Newspaper className="h-8 w-8" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Blog</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Stories and updates from educators will appear here. Browse activities on{' '}
            <Link className="font-medium text-emerald-800 underline-offset-4 hover:underline" href="/resources">
              learning activities
            </Link>{' '}
            in the meantime.
          </p>
        </div>
      </div>

      <Card padding="p-8" className="border-dashed border-slate-200 bg-white/90">
        <p className="text-sm leading-relaxed text-slate-700">
          Blog publishing is evolving on this MVP — check back soon for reflections, printable tips, and classroom wins.
        </p>
      </Card>
    </div>
  )
}
