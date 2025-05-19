"use client";

import { Skeleton } from "../ui/skeleton"

const LoadingCard = () => {
    return (
        <article className="bg-gray-50 dark:bg-gray-700 group relative h-full rounded-xl overflow-hidden shadow-md">
            {/* Image skeleton */}
            <div className="relative w-full h-48">
                <Skeleton className="absolute inset-0" />
                {/* Rating badge skeleton */}
                <Skeleton className="absolute top-2 right-2 w-16 h-6 rounded-md" />
                {/* Price tag skeleton */}
                <Skeleton className="absolute bottom-2 left-2 w-20 h-5 rounded-md" />
            </div>

            {/* Content skeleton */}
            <div className="p-3">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-full rounded-md mb-2" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>

                {/* Location and time skeleton */}
                <div className="mt-2 space-y-1">
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-4 w-1/3 rounded-md" />
                </div>

                {/* Action buttons skeleton */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                    {/* Details button skeleton */}
                    <Skeleton className="col-span-4 h-10 rounded-lg" />
                    
                    {/* Action buttons skeleton */}
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                </div>
            </div>
        </article>
    );
};

export default LoadingCard;