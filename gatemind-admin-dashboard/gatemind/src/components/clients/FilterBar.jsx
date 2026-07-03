import { PLANS, STATUSES } from '../../config/clients'

function Select({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring appearance-none rounded-lg border border-border-default bg-elevated py-2.5 pl-3 pr-8 text-sm text-text-primary transition hover:border-border-default/80"
      >
        <option value="ALL">{label}: All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0) + opt.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function FilterBar({ plan, onPlanChange, status, onStatusChange }) {
  return (
    <div className="flex items-center gap-2">
      <Select label="Plan" value={plan} onChange={onPlanChange} options={PLANS} />
      <Select label="Status" value={status} onChange={onStatusChange} options={STATUSES} />
    </div>
  )
}
