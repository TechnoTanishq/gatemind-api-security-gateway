export default function FeatureCard({ icon: Icon, title, description, comingSoon = false }) {
  return (
    <div className="group relative rounded-xl border border-border-subtle bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-glow">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-elevated text-cyan transition group-hover:border-cyan/40">
        <Icon size={18} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
        {comingSoon && (
          <span className="rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-signal">
            Soon
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  )
}
