export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <div className="max-w-xs md:max-w-md lg:max-w-lg">
          <div className="h-20 bg-muted rounded-3xl rounded-tl-sm animate-skeleton" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 bg-muted rounded-lg animate-skeleton" />
            <div className="h-4 bg-muted rounded animate-skeleton" />
            <div className="h-4 bg-muted rounded w-3/4 animate-skeleton" />
            <div className="h-10 bg-muted rounded animate-skeleton" />
          </div>
        ))}
      </div>
    </div>
  )
}
