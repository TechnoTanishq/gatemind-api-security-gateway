import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, ShieldHalf, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Simulated network delay so the loading state actually reads as real.
    setTimeout(() => {
      const result = login(username.trim(), password)
      setSubmitting(false)
      if (result.success) {
        const redirectTo = location.state?.from?.pathname || '/dashboard'
        navigate(redirectTo, { replace: true })
      } else {
        setError(result.error)
      }
    }, 450)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--c-text-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-text-primary)) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
            <ShieldHalf size={22} />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-text-primary">Admin access</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Sign in to the GateMind Security Operations Center
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border-subtle bg-surface p-6 shadow-elevated"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary" htmlFor="username">
                Username
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
                <User size={15} className="text-text-muted" />
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary" htmlFor="password">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
                <Lock size={15} className="text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="focus-ring text-text-muted hover:text-text-secondary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Verifying…' : 'Sign in'}
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] text-text-muted">
            Temporary credentials — <span className="font-mono">admin / admin123</span>
          </p>
        </form>

        <Link
          to="/"
          className="focus-ring mt-6 block text-center text-xs font-medium text-text-muted transition hover:text-text-secondary"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
