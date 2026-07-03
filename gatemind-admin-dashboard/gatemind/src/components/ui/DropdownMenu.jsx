import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

export default function DropdownMenu({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Row actions"
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition hover:bg-elevated hover:text-text-primary"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 overflow-hidden rounded-lg border border-border-default bg-elevated py-1 shadow-elevated animate-fade-up">
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 h-px bg-border-subtle" />
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                disabled={item.disabled}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  item.danger
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
