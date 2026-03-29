import { Skeleton } from "@/components/ui/Skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export default function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden">
      <div className="bg-neutral-50/50 px-10 py-6 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 rounded-full" />
        ))}
      </div>
      <div className="divide-y divide-neutral-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-10 py-8 flex gap-6 items-center">
            <Skeleton className="h-14 w-14 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
            {Array.from({ length: cols - 1 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
