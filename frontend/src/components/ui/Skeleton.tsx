interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-surface-container-highest rounded-xl ${className}`} />;
}

export function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-1 p-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-6 h-6 rounded-lg bg-surface-container-highest flex-shrink-0" />
          <div className="h-3 bg-surface-container-highest rounded flex-1 max-w-[120px]" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-surface-container-highest animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-surface-container-highest rounded w-24" />
          <div className="h-8 bg-surface-container-highest rounded w-16" />
          <div className="h-3 bg-surface-container-highest rounded w-20" />
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex-shrink-0" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-container-highest animate-pulse lg:col-span-2">
      <div className="h-5 bg-surface-container-highest rounded w-48 mb-2" />
      <div className="h-3 bg-surface-container-highest rounded w-32 mb-6" />
      <div className="h-[260px] bg-surface-container-highest rounded-lg" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-container-highest animate-pulse">
      <div className="h-5 bg-surface-container-highest rounded w-32 mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-container-highest flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-surface-container-highest rounded w-32" />
              <div className="h-2 bg-surface-container-highest rounded w-48" />
              <div className="h-2 bg-surface-container-highest rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className="h-12 rounded-[8px] bg-white border border-surface-container-highest animate-pulse" />
  );
}
