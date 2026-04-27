import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="rounded-2xl border bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Physical learning activities for schools
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-700">
          Browse hands-on activities and printable teaching resources. Students don’t need
          an account to view and download public materials.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Browse resources
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Teacher/Admin login
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Featured resources</h2>
          <Link href="/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            View all
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-6 text-sm text-zinc-700">
          Featured resources will appear here once you publish some in Supabase.
        </div>
      </section>
    </div>
  )
}
