interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[130px] flex flex-col">
      <div className="flex items-start justify-between mb-auto">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl ml-3" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-[280px] w-full rounded-xl" />
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start gap-4 px-4 py-3">
            <div className="flex flex-col items-center">
              <Skeleton className="w-3.5 h-3.5 rounded-full ring-4 ring-gray-100" />
              {i < 3 && <Skeleton className="w-0.5 h-8 mt-1" />}
            </div>
            <div className="flex items-start gap-3 flex-1">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-28 mb-1" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="w-px h-10 mx-1" />
      <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
    </div>
  );
}
