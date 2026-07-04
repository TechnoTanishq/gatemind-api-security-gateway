import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShieldHalf, X } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#roadmap', label: 'Roadmap' },
]

export default function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 border border-cyan/30 text-cyan">
            <ShieldHalf size={16} />
          </div>
          <span className="font-display text-base font-semibold text-text-primary">GateMind</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/client-login"
            className="focus-ring rounded-md border border-border-default bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="focus-ring rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-void transition hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="focus-ring rounded-md px-3 py-2 text-xs font-medium text-text-muted transition hover:text-text-secondary"
          >
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="focus-ring rounded-md p-1.5 text-text-secondary"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-subtle bg-base px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-sm font-medium text-text-secondary">{link.label}</a>
            ))}
            <Link to="/signup" onClick={() => setOpen(false)}
              className="focus-ring mt-2 rounded-md bg-cyan px-4 py-2 text-center text-sm font-semibold text-void">
              Get Started
            </Link>
            <Link to="/client-login" onClick={() => setOpen(false)}
              className="focus-ring rounded-md border border-border-default px-4 py-2 text-center text-sm text-text-secondary">
              Sign In
            </Link>
            <Link to="/login" onClick={() => setOpen(false)}
              className="text-center text-xs text-text-muted">
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
