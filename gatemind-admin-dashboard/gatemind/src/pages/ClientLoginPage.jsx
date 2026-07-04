import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldHalf } from 'lucide-react'
import { useClientAuth } from '../context/ClientAuthContext'

export default function ClientLoginPage() {
  const { isAuthenticated, login } = useClientAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/portal" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(email.trim(), password)
      const redirectTo = location.state?.from?.pathname || '/portal'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Invalid email or password.')
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
              <ShieldHalf size={20} />
            </div>
            <span className="font-display text-lg font-semibold text-text-primary">GateMind</span>
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold text-text-primary">Welcome back</h1>
            <p className="mt-1 text-sm text-text-secondary">Sign in to your GateMind portal.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-xl border border-border-subtle bg-surface p-6 shadow-elevated space-y-4">

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary" htmlFor="email">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
              <Mail size={15} className="text-text-muted" />
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@acme.com" required autoComplete="email"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary" htmlFor="password">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
              <Lock size={15} className="text-text-muted" />
              <input id="password" type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none" />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="focus-ring text-text-muted hover:text-text-secondary">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting}
            className="focus-ring flex w-full items-center justify-center rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-text-muted">
            No account yet?{' '}
            <Link to="/signup" className="text-cyan hover:underline">Get started for free</Link>
          </p>
        </form>

        <Link to="/" className="focus-ring mt-6 block text-center text-xs text-text-muted hover:text-text-secondary">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
