import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Clock,
  Compass,
  Download,
  GraduationCap,
  Info,
  PackageCheck,
  Printer,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getPublicResourceById } from '@/lib/queries/publicResources'

type Props = {
  params: Promise<{ id: string }>
}

function DetailStat({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</div>
    </div>
  )
}

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params
  const resource = await getPublicResourceById(id)

  return (
    <div className="grid gap-10 pb-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 underline-offset-4 hover:text-emerald-900 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to all activities
        </Link>
      </div>

      <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/40 p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <BookOpen className="h-4 w-4" aria-hidden />
              Jacaranda School · Learning activity
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{resource.title}</h1>
            <p className="mt-4 text-base font-medium text-emerald-900">Use this activity to prepare for class.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {resource.print_required ? (
              <Badge variant="stem">
                <span className="inline-flex items-center gap-1">
                  <Printer className="h-3 w-3" aria-hidden />
                  Printable
                </span>
              </Badge>
            ) : null}
            {!resource.extra_materials_required ? (
              <Badge variant="outline">
                <span className="inline-flex items-center gap-1">
                  <PackageCheck className="h-3 w-3" aria-hidden />
                  No extra materials
                </span>
              </Badge>
            ) : null}
            {resource.cutting_required ? <Badge variant="neutral">Cutting required</Badge> : null}
          </div>
        </div>

        <ul className="mt-8 grid gap-3 border-t border-slate-100 pt-8 text-sm text-slate-700 sm:grid-cols-2">
          <li className="flex gap-2 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-100">
            <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
            <span>Check what materials are needed before you start.</span>
          </li>
          <li className="flex gap-2 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-100">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden />
            <span>Students can view public activities without logging in.</span>
          </li>
        </ul>
      </Card>

      <section className="grid gap-6">
        <SectionHeader title="Activity overview" subtitle="What this activity is about." icon={BookOpen} />
        <Card padding="p-6">
          {resource.description ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{resource.description}</div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No full description yet"
              description="Use the outcome summary below to see what you will explore."
            />
          )}
        </Card>
      </section>

      <section className="grid gap-6">
        <SectionHeader title="What you will explore" subtitle="Outcomes and ideas to think about." icon={Sparkles} />
        <Card padding="p-6">
          {resource.result_description ? (
            <div className="flex gap-3">
              <Compass className="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden />
              <p className="text-base leading-relaxed text-slate-800">{resource.result_description}</p>
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No outcome summary yet"
              description="Ask your teacher what to focus on, or read the full description above."
            />
          )}
        </Card>
      </section>

      <section className="grid gap-6">
        <SectionHeader title="Grade levels and subjects" subtitle="Who this is for and what it connects to." icon={GraduationCap} />
        <Card padding="p-6">
          <div className="flex flex-wrap gap-2">
            {resource.subjects?.length ? (
              resource.subjects.map((s) => (
                <Badge key={s.id} variant="subject">
                  <span className="inline-flex items-center gap-1">
                    <Atom className="h-3 w-3" aria-hidden />
                    {s.name}
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-slate-500">No subjects tagged.</span>
            )}
            {resource.grade_levels?.length
              ? resource.grade_levels
                  .slice()
                  .sort((a, b) => a.grade_number - b.grade_number)
                  .map((g) => (
                    <Badge key={g.id} variant="outline">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" aria-hidden />
                        {g.name}
                      </span>
                    </Badge>
                  ))
              : null}
          </div>
        </Card>
      </section>

      <section className="grid gap-6">
        <SectionHeader title="Time and group size" subtitle="Plan your preparation and teamwork." icon={Clock} />
        <Card padding="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailStat Icon={Clock} label="Preparation time" value={resource.preparation_time} />
            <DetailStat Icon={Clock} label="Activity duration" value={resource.activity_duration} />
            <DetailStat
              Icon={UsersRound}
              label="Group size"
              value={
                resource.group_size_min != null || resource.group_size_max != null
                  ? `${resource.group_size_min ?? '—'}–${resource.group_size_max ?? '—'}`
                  : null
              }
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="grid gap-4">
          <SectionHeader title="Required materials" subtitle="Gather these before you start." icon={PackageCheck} />
          <Card padding="p-6">
            {resource.required_materials?.length ? (
              <ul className="grid gap-3">
                {resource.required_materials.map((m) => (
                  <li key={m.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
                    <div>
                      <div className="font-medium text-slate-900">
                        {m.quantity ? `${m.quantity}× ` : ''}
                        {m.name}
                      </div>
                      {m.note ? <div className="mt-1 text-xs text-slate-600">{m.note}</div> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={PackageCheck}
                title="No materials listed"
                description="This activity may rely on everyday classroom items only, or details may be in the description."
              />
            )}
          </Card>
        </div>

        <div className="grid gap-4">
          <SectionHeader title="Printable materials" subtitle="Download handouts when available." icon={Printer} />
          <Card padding="p-6">
            {resource.printable_materials?.length ? (
              <ul className="grid gap-4">
                {resource.printable_materials.map((f) => (
                  <li key={f.id} className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{f.title}</div>
                        {f.description ? <div className="mt-1 text-xs text-slate-600">{f.description}</div> : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {f.pages_count ? <Badge>{f.pages_count} pages</Badge> : null}
                          {f.paper_size ? <Badge>{f.paper_size}</Badge> : null}
                          {f.color_required ? <Badge>Color</Badge> : <Badge>B/W OK</Badge>}
                          {f.double_sided_recommended ? <Badge>Double-sided</Badge> : null}
                        </div>
                      </div>
                      <a
                        href={`/api/printable-materials/${f.id}/download`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Printer}
                title="No printable files attached"
                description="Check the activity description for anything you can copy or sketch by hand."
              />
            )}
          </Card>
        </div>
      </section>

      <Card className="border-sky-100 bg-sky-50/40 p-6">
        <p className="flex gap-3 text-sm leading-relaxed text-slate-800">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-800" aria-hidden />
          <span>
            <span className="font-semibold text-slate-900">Note:</span> public activities stay visible without an
            account. Your teacher may add extra instructions in class.
          </span>
        </p>
      </Card>
    </div>
  )
}
