import ArchitectureDiagram from './ArchitectureDiagram'

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="border-t border-border-subtle bg-surface/40 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-2 lg:px-6">
        <div className="flex flex-col justify-center">
          <h2 className="font-display text-3xl font-semibold text-text-primary">
            One gateway, in front of everything
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            GateMind doesn't live inside your services — it sits in front of them. Client
            applications talk to GateMind, GateMind talks to your backend. Nothing reaches
            your services without first clearing authentication, threat detection, and
            rate limiting.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Because it's a separate layer, adopting it doesn't mean rewriting your existing
            Spring Boot services — you point traffic at the gateway and it takes it from there.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-text-muted">Deployment model</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">Modular monolith</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-text-muted">State store</dt>
              <dd className="mt-1 text-sm font-medium text-text-primary">Redis + PostgreSQL</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-elevated">
          <ArchitectureDiagram />
        </div>
      </div>
    </section>
  )
}
