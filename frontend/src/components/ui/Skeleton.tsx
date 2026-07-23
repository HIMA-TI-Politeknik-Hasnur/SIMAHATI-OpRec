interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <Skeleton className="w-10 h-10 rounded-xl mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-5 w-36" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4 mb-2">
          <div className="flex flex-col items-center">
            <Skeleton className="w-[6px] h-[6px] rounded-full" />
            {i < 3 && <Skeleton className="w-[2px] h-8 mt-1" />}
          </div>
          <div className="flex-1 pb-3">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
