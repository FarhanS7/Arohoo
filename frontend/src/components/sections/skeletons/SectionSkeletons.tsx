import { Skeleton } from "@/components/ui/Skeleton";

export function TrendingProductsSkeleton() {
  return (
    <section className="fluid-py bg-white">
      <div className="responsive-container">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
        </div>
        <div className="responsive-grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingBrandsSkeleton() {
  return (
    <section className="fluid-py bg-white">
      <div className="responsive-container">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
        </div>
        <div className="responsive-grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-6 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingMallsSkeleton() {
  return (
    <section className="fluid-py bg-neutral-50/50">
      <div className="responsive-container">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-3 w-64 rounded-lg" />
          </div>
        </div>
        <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-3xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
