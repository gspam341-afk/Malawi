import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Newspaper, User } from 'lucide-react'
import { blogPostHref } from '@/lib/blog/links'
import { getPublishedBlogPosts } from '@/lib/queries/blogPosts'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Blog — Jacaranda School STEM',
  description: 'Stories and updates from Jacaranda School STEM.',
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-10 pb-12">
      <header className="flex flex-wrap items-start gap-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15">
          <Newspaper className="h-8 w-8" aria-hidden />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Blog</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Reflections, printable tips and classroom stories from Jacaranda School — browse by subject and read the full
            post.
          </p>
        </div>
      </header>

      {posts.length ? (
        <ul className="grid gap-6">
          {posts.map((post) => {
            const href = blogPostHref(post)
            const dateRaw = post.published_at ?? post.created_at
            const dateLabel = dateRaw ? new Date(dateRaw).toLocaleDateString(undefined, { dateStyle: 'medium' }) : null

            return (
              <li key={post.id}>
                <Card className="overflow-hidden border-slate-200/90 p-0 transition hover:border-emerald-200 hover:shadow-md" padding="p-0">
                  <Link href={href} className="grid gap-0 md:grid-cols-[220px_1fr]">
                    <div className="relative aspect-[4/3] bg-slate-100 md:aspect-auto md:min-h-[200px]">
                      {post.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- remote URLs
                        <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full min-h-[160px] items-center justify-center md:min-h-0">
                          <Newspaper className="h-12 w-12 text-emerald-200" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">{post.title}</h2>
                      {post.excerpt ? (
                        <p className="mt-3 line-clamp-3 text-slate-600">{post.excerpt}</p>
                      ) : (
                        <p className="mt-3 text-slate-500">Open to read the full post.</p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
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
                      <span className="mt-6 inline-flex text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline">
                        Read full post
                      </span>
                    </div>
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <Card className="border-dashed border-slate-200 bg-white/95 p-10 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-emerald-300" aria-hidden />
          <p className="mt-4 text-lg font-medium text-slate-900">No published posts yet.</p>
          <p className="mt-2 text-slate-600">
            Check back soon — teachers can publish stories from the dashboard when they are ready.
          </p>
          <Link
            href="/resources"
            className="mt-6 inline-block font-medium text-emerald-800 underline-offset-4 hover:underline"
          >
            Browse learning activities
          </Link>
        </Card>
      )}
    </div>
  )
}
