import Link from 'next/link'

export default async function AuthErrorPage(props: { searchParams?: Promise<{ message?: string }> }) {
  const { message } = (await props.searchParams) ?? {}

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Authentication error</h1>
        <p className="mt-2 text-sm text-zinc-700">
          {message ? message : 'Something went wrong while confirming your account.'}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-900 hover:underline">
            Go to login
          </Link>
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-950">
            Home
          </Link>
        </div>
      </section>
    </div>
  )
}
