import { KeyRound, ShieldAlert, Gauge, LineChart, Sparkles, Building2 } from 'lucide-react'
import FeatureCard from '../cards/FeatureCard'

const FEATURES = [
  {
    icon: KeyRound,
    title: 'API Authentication',
    description: 'Every request is verified against a registered API key before it goes anywhere near your backend.',
  },
  {
    icon: ShieldAlert,
    title: 'Threat Detection',
    description: 'Inline checks for SQL injection, XSS, path traversal, command injection, and suspicious user agents.',
  },
  {
    icon: Gauge,
    title: 'Redis Rate Limiting',
    description: 'Per-client limits enforced at the edge, backed by Redis, so noisy or abusive clients never reach you.',
  },
  {
    icon: LineChart,
    title: 'Security Analytics',
    description: 'Every request is logged to PostgreSQL, giving you a full audit trail of what was allowed and blocked.',
  },
  {
    icon: Sparkles,
    title: 'AI Threat Detection',
    description: 'Model-driven anomaly scoring layered on top of rule-based checks for threats signatures miss.',
    comingSoon: true,
  },
  {
    icon: Building2,
    title: 'Multi-tenant SaaS',
    description: 'Fully isolated client dashboards, usage tiers, and billing for teams running GateMind at scale.',
    comingSoon: true,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border-subtle bg-base py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text-primary">
            Everything a gateway should do — nothing it shouldn't
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            Six checks run on every request. None of them require touching your backend code.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
