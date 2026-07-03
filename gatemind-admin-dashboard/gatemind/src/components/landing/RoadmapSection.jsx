import { Brain, Lightbulb, LayoutDashboard, CreditCard, Container } from 'lucide-react'

const ROADMAP = [
  { icon: Brain, label: 'AI Risk Scoring' },
  { icon: Lightbulb, label: 'Explainable AI' },
  { icon: LayoutDashboard, label: 'Client Dashboard' },
  { icon: CreditCard, label: 'Billing' },
  { icon: Container, label: 'Kubernetes Deployment' },
]

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="border-t border-border-subtle bg-surface/40 py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text-primary">What's next</h2>
          <p className="mt-3 text-sm text-text-secondary">
            The rule-based gateway is live. This is what's being built on top of it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ROADMAP.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-default bg-surface p-5 text-center transition hover:border-violet/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-violet">
                <item.icon size={17} />
              </div>
              <p className="text-xs font-medium text-text-secondary">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
