import { Skeleton } from "@/components/ui/Skeleton";

export function TrendingProductsSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
            <Skeleton className="h-4 w-64 sm:h-5 sm:w-80" />
          </div>
          <Skeleton className="hidden sm:block h-5 w-24" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-xl sm:rounded-[2rem] bg-white border border-neutral-100 p-0 overflow-hidden"
            >
              {/* Image Skeleton */}
              <Skeleton className="h-48 sm:h-80 w-full rounded-none" />
              
              {/* Content Skeleton */}
              <div className="p-4 sm:p-7 space-y-3">
                <Skeleton className="h-4 w-3/4 sm:h-6" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16 sm:h-7 sm:w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
