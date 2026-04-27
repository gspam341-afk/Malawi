import { LoginForm } from '@/app/login/LoginForm'

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Students do not need an account for basic access. Login is for teachers, alumni,
        donors, and admins.
      </p>

      <LoginForm />
    </div>
  )
}
