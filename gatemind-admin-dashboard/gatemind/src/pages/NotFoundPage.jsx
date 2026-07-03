import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base px-4 text-center">
      <ShieldAlert size={40} className="text-signal" />
      <h1 className="font-display text-2xl font-semibold text-text-primary">404 — Route not found</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        This path never reached a backend either. Let's get you back to somewhere real.
      </p>
      <Link
        to="/"
        className="focus-ring rounded-md bg-cyan px-4 py-2 text-sm font-medium text-void transition hover:opacity-90"
      >
        Return home
      </Link>
    </div>
  )
}
