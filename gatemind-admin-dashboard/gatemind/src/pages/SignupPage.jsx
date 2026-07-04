import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, Link as LinkIcon, Lock, Mail, ShieldHalf } from 'lucide-react'
import { useClientAuth } from '../context/ClientAuthContext'
import ApiKeyRevealModal from '../components/clients/ApiKeyRevealModal'

const PLANS = ['FREE', 'PRO', 'ENTERPRISE']

export default function SignupPage() {
  const { isAuthenticated, register } = useClientAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '', email: '', password: '', backendBaseUrl: '', plan: 'FREE',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [revealedKey, setRevealedKey] = useState(null)

  if (isAuthenticated) return <Navigate to="/portal" replace />

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!/^https?:\/\/.+/.test(form.backendBaseUrl.trim())) {
      setError('Backend URL must start with http:// or https://')
      return
    }
    setSubmitting(true)
    try {
      const result = await register(form)
      // Show the API key modal — key is only returned once
      setRevealedKey({ apiKey: result.apiKey, companyName: result.companyName })
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.')
      setSubmitting(false)
    }
  }

  function handleKeyModalClose() {
    setRevealedKey(null)
    navigate('/portal', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
              <ShieldHalf size={20} />
            </div>
            <span className="font-display text-lg font-semibold text-text-primary">GateMind</span>
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold text-text-primary">Create your account</h1>
            <p className="mt-1 text-sm text-text-secondary">Start protecting your API in minutes.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border-subtle bg-surface p-6 shadow-elevated space-y-4"
        >
          {/* Company Name */}
          <Field label="Company Name">
            <InputRow icon={Building2}>
              <input name="companyName" value={form.companyName} onChange={handleChange}
                placeholder="Acme Corp" required
                className={inputCls} />
            </InputRow>
          </Field>

          {/* Email */}
          <Field label="Email">
            <InputRow icon={Mail}>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="admin@acme.com" required
                className={inputCls} />
            </InputRow>
          </Field>

          {/* Password */}
          <Field label="Password">
            <InputRow icon={Lock} suffix={
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="text-text-muted hover:text-text-secondary focus-ring">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }>
              <input name="password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="Min 8 characters" required
                className={inputCls} />
            </InputRow>
          </Field>

          {/* Backend Base URL */}
          <Field label="Your Backend Base URL" hint="GateMind will proxy all requests to this URL.">
            <InputRow icon={LinkIcon}>
              <input name="backendBaseUrl" type="url" value={form.backendBaseUrl} onChange={handleChange}
                placeholder="http://localhost:8085" required
                className={inputCls} />
            </InputRow>
          </Field>

          {/* Plan */}
          <Field label="Plan">
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map((p) => (
                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, plan: p }))}
                  className={`focus-ring rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    form.plan === p
                      ? 'border-cyan/50 bg-cyan/10 text-cyan'
                      : 'border-border-default bg-elevated text-text-secondary hover:border-border-default/80'
                  }`}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting}
            className="focus-ring flex w-full items-center justify-center rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60">
            {submitting ? 'Creating account…' : 'Get Started'}
          </button>

          <p className="text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/client-login" className="text-cyan hover:underline">Sign in</Link>
          </p>
        </form>

        <Link to="/" className="focus-ring mt-6 block text-center text-xs text-text-muted hover:text-text-secondary">
          ← Back to home
        </Link>
      </div>

      {revealedKey && (
        <ApiKeyRevealModal
          open={true}
          onClose={handleKeyModalClose}
          companyName={revealedKey.companyName}
          apiKey={revealedKey.apiKey}
          title="Account created — save your API key"
        />
      )}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-secondary">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-text-muted">{hint}</p>}
    </div>
  )
}

function InputRow({ icon: Icon, suffix, children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
      <Icon size={15} className="shrink-0 text-text-muted" />
      {children}
      {suffix}
    </div>
  )
}

const inputCls = 'w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none'
