import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search company…' }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border-default bg-elevated px-3 py-2.5 focus-within:border-cyan/50 sm:max-w-xs">
      <Search size={14} className="text-text-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="focus-ring shrink-0 text-text-muted hover:text-text-secondary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
