import { Sparkles, ShieldCheck } from 'lucide-react'
import { LoginForm } from '@/app/login/LoginForm'

export default function LoginPage() {
  return (
    <section className="relative mx-auto grid w-full max-w-5xl gap-8 overflow-hidden rounded-jac-xl border border-jac-purple/22 bg-white px-5 py-6 shadow-[0_10px_30px_-16px_rgba(28,24,48,0.2)] md:grid-cols-2 md:gap-10 md:px-8 md:py-10 lg:px-10">
      <div className="jac-blob bg-jac-purple/18 -right-20 -top-20 h-64 w-64" aria-hidden />
      <div className="jac-blob bg-jac-pink/22 -bottom-20 -left-12 h-64 w-64" aria-hidden />

      <div className="relative rounded-jac-lg border border-jac-purple/16 bg-jac-offwhite/70 p-6 md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-jac-purple/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-jac-purple">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Welcome back
        </p>
        <h1 className="mt-5 text-h2">Login to Jacaranda Hub</h1>
        <p className="mt-4 text-body">
          Students do not need an account for basic access. Login is for teachers, alumni, donors, and admins.
        </p>

        <div className="mt-8 rounded-jac-md border border-jac-green/22 bg-white px-4 py-3">
          <p className="inline-flex items-start gap-2 text-sm text-jac-navy/80">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-jac-green" aria-hidden />
            Secure sign-in with your school account. You will be redirected directly to your dashboard.
          </p>
        </div>
      </div>

      <div className="relative rounded-jac-lg border border-jac-purple/18 bg-white p-6 shadow-[0_6px_20px_-14px_rgba(28,24,48,0.26)] md:p-8">
        <LoginForm />
      </div>
    </section>
  )
}
