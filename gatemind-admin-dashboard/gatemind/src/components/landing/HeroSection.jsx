import { Link } from 'react-router-dom'
import { ArrowRight, KeyRound, Gauge, ShieldAlert, Sparkles } from 'lucide-react'
import GatewayDiagram from './GatewayDiagram'

const PILLS = [
  { icon: KeyRound, label: 'API Key Authentication' },
  { icon: Gauge, label: 'Redis Rate Limiting' },
  { icon: ShieldAlert, label: 'Threat Detection' },
  { icon: Sparkles, label: 'AI Powered Analysis — coming soon' },
]

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--c-text-primary)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-text-primary)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 lg:px-6 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan">
            <Sparkles size={12} />
            Built for Spring Boot microservices
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-text-primary sm:text-5xl lg:text-6xl">
            Intelligent API<br />Security Platform
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary">
            GateMind sits in front of your backend and inspects every request before it
            arrives — authenticating, rate limiting, and screening for the attacks that
            actually hit production APIs.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="focus-ring group inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-void transition hover:opacity-90"
            >
              Start for Free
              <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/client-login"
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border-default bg-elevated px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-cyan/40 hover:text-cyan"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {PILLS.map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-secondary"
              >
                <pill.icon size={12} className="text-text-muted" />
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border-subtle bg-surface/60 p-6 shadow-elevated animate-fade-up">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-text-muted">
            Every request, checked in sequence
          </p>
          <GatewayDiagram />
        </div>
      </div>
    </section>
  )
}
