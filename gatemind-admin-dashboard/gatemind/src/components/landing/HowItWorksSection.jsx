import { Building2, KeyRound, Code2, Waypoints, ShieldCheck } from 'lucide-react'

const STEPS = [
  {
    icon: Building2,
    title: 'Register your company',
    description: 'Create a GateMind account for your organization in a couple of minutes.',
  },
  {
    icon: KeyRound,
    title: 'Receive an API key',
    description: 'GateMind issues a unique key tied to your account and its rate limits.',
  },
  {
    icon: Code2,
    title: 'Add the key to your backend',
    description: 'Attach it as a header on requests headed for GateMind.',
    code: true,
  },
  {
    icon: Waypoints,
    title: 'Every request passes through',
    description: 'Traffic is authenticated, screened, and rate limited automatically.',
  },
  {
    icon: ShieldCheck,
    title: 'Threats are blocked',
    description: 'Malicious requests are stopped before they ever reach your backend.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border-subtle bg-base py-20">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text-primary">How it works</h2>
          <p className="mt-3 text-sm text-text-secondary">From sign-up to your first blocked request.</p>
        </div>

        <div className="mt-12 space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                  <step.icon size={17} />
                </div>
                {i < STEPS.length - 1 && <div className="mt-2 w-px flex-1 bg-border-default" />}
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">0{i + 1}</span>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{step.description}</p>

                {step.code && (
                  <pre className="mt-3 overflow-x-auto rounded-lg border border-border-subtle bg-surface p-4 font-mono text-xs leading-relaxed text-text-secondary">
{`GET /orders HTTP/1.1
Host: api.company.com
X-API-Key: gm_live_xxxxxxxxx`}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
