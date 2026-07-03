import { Github, ShieldHalf } from 'lucide-react'
import { APP_CONFIG } from '../../config/app'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-base py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan/10 border border-cyan/30 text-cyan">
                <ShieldHalf size={14} />
              </div>
              <span className="font-display text-sm font-semibold text-text-primary">
                {APP_CONFIG.name}
              </span>
              <span className="rounded-full border border-border-default bg-surface px-2 py-0.5 text-[10px] font-mono text-text-muted">
                {APP_CONFIG.version}
              </span>
            </div>
            <p className="mt-2 max-w-xs text-xs text-text-muted">
              An AI-powered API security gateway for Spring Boot microservices.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Product</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
                <a href="#features" className="transition hover:text-text-primary">Features</a>
                <a href="#architecture" className="transition hover:text-text-primary">Architecture</a>
                <a href="#roadmap" className="transition hover:text-text-primary">Roadmap</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Resources</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
                <a
                  href={APP_CONFIG.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition hover:text-text-primary"
                >
                  <Github size={13} /> GitHub
                </a>
                <a href={APP_CONFIG.docsUrl} className="transition hover:text-text-primary">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} {APP_CONFIG.name}. Internal admin tooling — customer-facing dashboard coming later.
        </div>
      </div>
    </footer>
  )
}
