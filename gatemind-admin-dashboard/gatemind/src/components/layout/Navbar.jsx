import { Bell, Menu, UserCircle } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { session } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-base/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-md p-1.5 text-text-secondary hover:bg-elevated hover:text-text-primary lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="font-display text-sm font-semibold text-text-primary">
            Security Operations Center
          </p>
          <p className="hidden text-xs text-text-muted sm:block">
            Real-time API threat monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          className="focus-ring relative flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-elevated text-text-secondary transition hover:text-cyan hover:border-cyan/40"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <div className="flex items-center gap-2 rounded-md border border-border-default bg-elevated px-2.5 py-1.5">
          <UserCircle size={18} className="text-text-secondary" />
          <span className="hidden text-xs font-medium text-text-primary sm:block">
            {session?.username || 'admin'}
          </span>
        </div>
      </div>
    </header>
  )
}
