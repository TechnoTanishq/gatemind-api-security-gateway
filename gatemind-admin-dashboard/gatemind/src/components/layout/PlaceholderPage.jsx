export default function PlaceholderPage({ icon: Icon, title, description, roadmap = [] }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface/50 px-6 py-16 text-center animate-fade-up">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet/30 bg-violet/10 text-violet">
        <Icon size={22} />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>

      {roadmap.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {roadmap.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border-default bg-elevated px-3 py-1 text-xs font-medium text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
