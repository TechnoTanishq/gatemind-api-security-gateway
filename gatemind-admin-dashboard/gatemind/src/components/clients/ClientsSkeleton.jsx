export default function ClientsSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-border-subtle bg-elevated/40 px-4 py-3.5"
        >
          <div className="h-8 w-8 shrink-0 rounded-lg bg-elevated animate-pulse-slow" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-elevated animate-pulse-slow" />
            <div className="h-2.5 w-1/5 rounded bg-elevated animate-pulse-slow" />
          </div>
          <div className="h-5 w-16 rounded-full bg-elevated animate-pulse-slow" />
          <div className="h-5 w-20 rounded-full bg-elevated animate-pulse-slow hidden sm:block" />
          <div className="h-3 w-16 rounded bg-elevated animate-pulse-slow hidden md:block" />
        </div>
      ))}
    </div>
  )
}
