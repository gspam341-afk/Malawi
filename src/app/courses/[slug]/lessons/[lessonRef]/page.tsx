import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, PackageCheck, Printer } from 'lucide-react'
import { BlogMarkdownRenderer } from '@/components/blog/BlogMarkdownRenderer'
import { ResourceCard } from '@/components/ResourceCard'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getPublicResourceById } from '@/lib/queries/publicResources'
import { getPublishedLessonInCourse } from '@/lib/queries/publicCourses'
import type { ResourceListItem } from '@/types/db'

type Props = { params: Promise<{ slug: string; lessonRef: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, lessonRef } = await props.params
  const bundle = await getPublishedLessonInCourse(slug, lessonRef)
  if (!bundle) return { title: 'Lesson — Jacaranda Learning Hub' }
  return {
    title: `${bundle.lesson.title} — ${bundle.course.title}`,
    description: bundle.lesson.description ?? undefined,
  }
}

export default async function PublicLessonPage(props: Props) {
  const { slug, lessonRef } = await props.params
  const bundle = await getPublishedLessonInCourse(slug, lessonRef)
  if (!bundle) notFound()

  const { course, lesson, resourceIds } = bundle

  const resources: ResourceListItem[] = []
  for (const id of resourceIds) {
    try {
      const r = await getPublicResourceById(id)
      resources.push(r as unknown as ResourceListItem)
    } catch {
      /* resource may be restricted; skip */
    }
  }

  return (
    <div className="grid gap-10 pb-12 md:gap-12">
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-jac-purple underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to course
        </Link>
      </div>

      <header className="rounded-jac-xl border-2 border-jac-purple/18 bg-white px-6 py-10 shadow-jac-medium md:px-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-jac-purple">
          {course.title} · {lesson.unit.title}
        </p>
        <h1 className="text-h1 mt-4">{lesson.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="purple">{lesson.lesson_type.replace(/_/g, ' ')}</Badge>
        </div>
        {lesson.description ? (
          <p className="mt-6 max-w-3xl text-base text-jac-navy/85 md:text-lg">{lesson.description}</p>
        ) : null}
      </header>

      {lesson.content?.trim() ? (
        <section className="grid gap-4">
          <SectionHeader title="Lesson content" subtitle="Read and prepare before class." icon={BookOpen} />
          <Card padding="p-6 md:p-8">
            <BlogMarkdownRenderer markdown={lesson.content} />
          </Card>
        </section>
      ) : null}

      <section className="grid gap-6">
        <SectionHeader
          title="Activities and materials"
          subtitle="Linked from the resource library — open each for printables and supply lists."
          icon={Printer}
        />
        {resources.length ? (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageCheck}
            title="No linked activities yet"
            description="Your teacher may add printable activities here later. You can still browse all public activities from the resource catalog."
          />
        )}
      </section>
    </div>
  )
}
