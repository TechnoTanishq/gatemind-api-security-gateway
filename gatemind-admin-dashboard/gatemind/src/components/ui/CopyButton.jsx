import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyButton({ value, className = '' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API can fail in insecure contexts — fail silently, button just won't confirm.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`focus-ring inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
        copied
          ? 'border-success/40 bg-success/10 text-success'
          : 'border-border-default bg-elevated text-text-secondary hover:border-cyan/40 hover:text-cyan'
      } ${className}`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
