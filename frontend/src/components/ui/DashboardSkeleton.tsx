import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-16 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Skeleton className="h-32 rounded-[2.5rem]" />
        <Skeleton className="h-32 rounded-[2.5rem]" />
        <Skeleton className="h-32 rounded-[2.5rem]" />
        <Skeleton className="h-32 rounded-[2.5rem]" />
      </div>

      <div className="space-y-8">
        <Skeleton className="h-12 w-full max-w-md rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-44 rounded-[2.5rem]" />
          <Skeleton className="h-44 rounded-[2.5rem]" />
          <Skeleton className="h-44 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
