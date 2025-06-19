// app/locations/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>

      <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Hero Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg h-64 md:h-96">
          <Skeleton className="absolute w-full h-full" />
        </div>

        {/* Title & Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <Skeleton className="h-10 w-64 rounded mb-2" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20 rounded" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="rounded-xl shadow-md p-4 mb-8 flex flex-wrap gap-4 justify-between">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-6 w-32 rounded" />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-8 w-32 rounded" />
          </div>
          {/* Tab Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}