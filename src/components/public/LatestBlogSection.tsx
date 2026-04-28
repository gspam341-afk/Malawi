import Link from 'next/link'
import { ArrowRight, Calendar, Newspaper, User } from 'lucide-react'
import { blogPostHref } from '@/lib/blog/links'
import { getLatestPublishedBlogPostForHome } from '@/lib/queries/blogPosts'
import { subjectBadgeVariant } from '@/lib/subjectBadgeVariant'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'

export async function LatestBlogSection() {
  const post = await getLatestPublishedBlogPostForHome()
  if (!post) return null

  const dateRaw = post.published_at ?? post.created_at
  const dateLabel = dateRaw ? new Date(dateRaw).toLocaleDateString(undefined, { dateStyle: 'medium' }) : null

  const href = blogPostHref(post)

  return (
    <section className="rounded-jac-xl border-2 border-jac-purple/22 bg-gradient-to-br from-white via-jac-pink/35 to-jac-purple/[0.12] px-6 py-12 shadow-[0_14px_48px_-14px_rgba(115,72,206,0.2)] md:px-12 lg:rounded-[40px]">
      <div className="jac-blob bg-jac-purple/15 -left-12 top-8 hidden h-40 w-40 md:block" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-jac-purple md:text-sm">
            <Newspaper className="h-4 w-4" aria-hidden />
            Latest from Jacaranda STEM
          </p>
          <h2 className="font-display mt-4 text-[28px] leading-tight tracking-tight text-jac-navy md:text-[36px]">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-5 text-base leading-relaxed text-jac-navy/[0.9] md:text-lg">{post.excerpt}</p>
          ) : (
            <p className="mt-5 text-base text-jac-navy/70 md:text-lg">Read the newest story from our STEM blog.</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-body md:text-sm">
            {dateLabel ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-jac-purple" aria-hidden />
                {dateLabel}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-jac-purple" aria-hidden />
              {post.author_name?.trim() || 'Jacaranda STEM'}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.subjects.map((s) => (
              <Badge key={s.id} variant={subjectBadgeVariant(s.name)}>
                {s.name}
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href={href} icon={Newspaper} iconRight={ArrowRight}>
              Read post
            </ButtonLink>
          </div>
          <p className="mt-6 text-body">
            More stories on the{' '}
            <Link href="/blog" className="font-medium text-jac-purple underline-offset-4 hover:underline">
              blog
            </Link>
            .
          </p>
        </div>
        <div className="order-1 lg:order-2">
          {post.cover_image_url ? (
            <Link
              href={href}
              className="group block overflow-hidden rounded-jac-lg border border-jac-purple/15 shadow-jac-medium ring-1 ring-jac-purple/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 focus-visible:ring-offset-jac-offwhite"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote teacher-provided URLs */}
              <img
                src={post.cover_image_url}
                alt=""
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-jac-lg border-2 border-dashed border-jac-purple/35 bg-gradient-to-br from-jac-purple/[0.06] to-jac-pink/25">
              <Newspaper className="h-16 w-16 text-jac-purple/55" aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
