export function formatNumber(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value
  )
}

export function formatExactNumber(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function formatTimestamp(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export const THREAT_COLORS = {
  'SQL Injection': '#F0466E',
  'XSS': '#FFB020',
  'Path Traversal': '#8B7CF6',
  'Command Injection': '#22D3EE',
  'Suspicious User Agent': '#34D399',
  'Rate Limit': '#F97316',
  'Other': '#5C6577',
}

export function colorForThreat(name) {
  return THREAT_COLORS[name] || THREAT_COLORS.Other
}
