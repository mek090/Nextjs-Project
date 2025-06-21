// app/locations/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4 sm:py-6 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-3 sm:mb-4 flex-wrap">
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded" />
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded" />
        <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 rounded" />
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Hero Image */}
        <div className="relative mb-6 sm:mb-8 rounded-lg sm:rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64 md:h-80 lg:h-96">
          <Skeleton className="absolute w-full h-full" />
        </div>

        {/* Title & Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Skeleton className="h-8 sm:h-9 md:h-10 w-48 sm:w-56 md:w-64 rounded mb-2" />
          <div className="flex gap-2 sm:gap-3">
            <Skeleton className="h-8 sm:h-9 md:h-10 w-16 sm:w-20 rounded" />
            <Skeleton className="h-8 sm:h-9 md:h-10 w-8 sm:w-10 rounded-full" />
            <Skeleton className="h-8 sm:h-9 md:h-10 w-8 sm:w-10 rounded-full" />
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 mb-6 sm:mb-8 flex flex-wrap gap-3 sm:gap-4 justify-between">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 rounded" />
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 rounded" />
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 rounded" />
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
            <Skeleton className="h-7 sm:h-8 w-24 sm:w-32 rounded" />
            <Skeleton className="h-7 sm:h-8 w-24 sm:w-32 rounded" />
            <Skeleton className="h-7 sm:h-8 w-24 sm:w-32 rounded" />
          </div>
          {/* Tab Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Skeleton className="h-24 sm:h-28 md:h-32 w-full rounded-lg sm:rounded-xl" />
              <Skeleton className="h-24 sm:h-28 md:h-32 w-full rounded-lg sm:rounded-xl" />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <Skeleton className="h-64 sm:h-72 md:h-80 w-full rounded-lg sm:rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}