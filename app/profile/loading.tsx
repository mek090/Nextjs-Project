
'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { ClipboardList, Settings } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* กล่อง Profile Tabs */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Tabs Header */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md">
            <div className="grid grid-cols-2 w-full md:w-80 gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Tabs Content Skeleton */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-md space-y-4">
            {/* Title */}
            <Skeleton className="h-6 w-1/3 rounded-md" />
            {/* Line items */}
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
