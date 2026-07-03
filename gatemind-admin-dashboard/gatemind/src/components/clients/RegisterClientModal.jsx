import { useState } from 'react'
import { Building2, Mail } from 'lucide-react'
import Modal from '../ui/Modal'
import { PLANS } from '../../config/clients'
import { registerClient } from '../../api/clientsApi'

export default function RegisterClientModal({ open, onClose, onRegistered }) {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('FREE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    setCompanyName('')
    setEmail('')
    setPlan('FREE')
    setError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name is required.')
      return
    }
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const result = await registerClient({ 
        companyName: companyName.trim(), 
        email: email.trim(), 
        plan 
      })
      const submittedPlan = plan
      setCompanyName('')
      setEmail('')
      setPlan('FREE')
      onRegistered({ ...result, plan: submittedPlan })
    } catch (err) {
      setError(err?.message || 'Could not register this client. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register client"
      description="Add a new company to GateMind and issue their first API key."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary" htmlFor="companyName">
            Company name
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
            <Building2 size={15} className="text-text-muted" />
            <input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Netflix"
              autoFocus
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary" htmlFor="email">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50">
            <Mail size={15} className="text-text-muted" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@netflix.com"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {PLANS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`focus-ring rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  plan === p
                    ? 'border-cyan/50 bg-cyan/10 text-cyan'
                    : 'border-border-default bg-elevated text-text-secondary hover:border-border-default/80'
                }`}
              >
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="focus-ring flex-1 rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring flex-1 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Registering…' : 'Register client'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
