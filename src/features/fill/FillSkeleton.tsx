function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${className ?? ''}`} />
}

export function FillSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Shimmer className="h-8 w-8 rounded-lg" />
        <Shimmer className="h-5 w-40 rounded-md" />
        <div className="flex-1" />
        <Shimmer className="h-8 w-28 rounded-lg" />
        <Shimmer className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <Shimmer className="h-7 w-56 rounded-md" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Shimmer className="h-3.5 w-28 rounded" />
              <Shimmer className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Shimmer className="h-11 w-full rounded-xl mt-2" />
        </div>
      </div>
    </div>
  )
}
