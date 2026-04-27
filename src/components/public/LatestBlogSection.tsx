import Link from 'next/link'
import { ArrowRight, Calendar, Newspaper, User } from 'lucide-react'
import { blogPostHref } from '@/lib/blog/links'
import { getLatestPublishedBlogPostForHome } from '@/lib/queries/blogPosts'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'

export async function LatestBlogSection() {
  const post = await getLatestPublishedBlogPostForHome()
  if (!post) return null

  const dateRaw = post.published_at ?? post.created_at
  const dateLabel = dateRaw ? new Date(dateRaw).toLocaleDateString(undefined, { dateStyle: 'medium' }) : null

  const href = blogPostHref(post)

  return (
    <section className="rounded-[2rem] border border-emerald-100/90 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 px-6 py-12 shadow-md shadow-emerald-900/5 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <Newspaper className="h-4 w-4" aria-hidden />
            Latest from Jacaranda STEM
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{post.title}</h2>
          {post.excerpt ? (
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{post.excerpt}</p>
          ) : (
            <p className="mt-4 text-lg text-slate-600">Read the newest story from our STEM blog.</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {dateLabel ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-700" aria-hidden />
                {dateLabel}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-emerald-700" aria-hidden />
              {post.author_name?.trim() || 'Jacaranda STEM'}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.subjects.map((s) => (
              <Badge key={s.id} variant="subject">
                {s.name}
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href={href} icon={Newspaper} iconRight={ArrowRight}>
              Read post
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            More stories on the{' '}
            <Link href="/blog" className="font-medium text-emerald-800 underline-offset-4 hover:underline">
              blog
            </Link>
            .
          </p>
        </div>
        <div className="order-1 lg:order-2">
          {post.cover_image_url ? (
            <Link href={href} className="group block overflow-hidden rounded-2xl border border-slate-200/90 shadow-lg ring-1 ring-emerald-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote teacher-provided URLs */}
              <img
                src={post.cover_image_url}
                alt=""
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white/80">
              <Newspaper className="h-16 w-16 text-emerald-300" aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
