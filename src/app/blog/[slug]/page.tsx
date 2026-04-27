import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Newspaper, User } from 'lucide-react'
import { BlogMarkdownRenderer } from '@/components/blog/BlogMarkdownRenderer'
import { getPublishedBlogPostBySlugOrId } from '@/lib/queries/blogPosts'
import { Badge } from '@/components/ui/Badge'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getPublishedBlogPostBySlugOrId(slug)
  if (!post) return { title: 'Blog — Jacaranda School' }
  return {
    title: `${post.title} — Jacaranda School STEM`,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params
  const post = await getPublishedBlogPostBySlugOrId(slug)
  if (!post) notFound()

  const dateRaw = post.published_at ?? post.created_at
  const dateLabel = dateRaw ? new Date(dateRaw).toLocaleDateString(undefined, { dateStyle: 'long' }) : null

  return (
    <article className="mx-auto w-full max-w-3xl pb-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </div>

      <header className="border-b border-slate-100 pb-10">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <Newspaper className="h-4 w-4" aria-hidden />
          Jacaranda STEM blog
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-6 text-xl leading-relaxed text-slate-600">{post.excerpt}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {dateLabel ? (
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-700" aria-hidden />
              {dateLabel}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-700" aria-hidden />
            {post.author_name?.trim() || 'Jacaranda STEM'}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.subjects.map((s) => (
            <Badge key={s.id} variant="subject">
              {s.name}
            </Badge>
          ))}
        </div>
      </header>

      {post.cover_image_url ? (
        <div className="my-10 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image_url} alt="" className="max-h-[min(520px,70vh)] w-full object-cover" />
        </div>
      ) : null}

      <div className="prose-article mt-10">
        <BlogMarkdownRenderer markdown={post.content ?? ''} />
      </div>
    </article>
  )
}
