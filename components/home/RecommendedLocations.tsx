// components/RecommendedLocations.tsx
"use client";

import { useEffect, useState } from 'react';
import { LocationCardProps } from "@/utils/types";
import LocationCard from "../card/LocationCard";
import { Sparkles } from "lucide-react";
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

export default function RecommendedLocations() {
    const [recommendations, setRecommendations] = useState<LocationCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('/api/recommendations');
                const data = await response.json();
                setRecommendations(data.recommendedLocations);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <section className="py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/70 dark:to-gray-950">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                    {isLoading ? (
                        <div className="flex items-center">
                            <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded mr-2 sm:mr-3" />
                            <Skeleton className="h-6 w-48 sm:h-7 sm:w-64" />
                        </div>
                    ) : (
                        <>
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mr-3 shadow-lg">
                                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl pt-2 font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    สถานที่แนะนำเพิ่มเติมสำหรับคุณ
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    ค้นพบสถานที่ท่องเที่ยวที่คัดสรรมาเป็นพิเศษ
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {isLoading ? (
                        // Skeleton Loading Cards
                        [...Array(4)].map((_, index) => (
                            <RecommendationSkeleton key={index} />
                        ))
                    ) : recommendations.length === 0 ? (
                        // Empty State
                        <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                            <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 text-center">
                                ไม่มีสถานที่แนะนำ
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 text-center max-w-md px-4">
                                ขณะนี้ยังไม่มีสถานที่แนะนำสำหรับคุณ กรุณาเพิ่มสถานที่โปรดเพื่อทำการวิเคราะห์
                            </p>
                        </div>
                    ) : (
                        // Actual Content
                        recommendations.slice(0, 4).map((location, index) => (
                            <div
                                key={location.id}
                                className="transform transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <LocationCard Location={location} />
                            </div>
                        ))
                    )}
                </div>

                {/* Show More Button for non-loading state */}
                {!isLoading && recommendations.length > 0 && (
                    <div className="flex justify-center mt-8 sm:mt-12">
                        <Link href="/locations" className="inline-block">
                            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl dark:from-blue-900 dark:to-purple-900 dark:hover:from-blue-800 dark:hover:to-purple-800 text-sm sm:text-base">
                                ดูสถานที่เพิ่มเติม
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

// Skeleton Component for Recommendations
function RecommendationSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative">
                <Skeleton className="h-40 sm:h-48 w-full" />
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {/* Title */}
                <Skeleton className="h-5 sm:h-6 w-3/4" />

                {/* Description lines */}
                <div className="space-y-1.5 sm:space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-2/3" />
                </div>

                {/* Location and rating */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    </div>
                    <div className="flex items-center space-x-1">
                        <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-6 sm:w-8" />
                    </div>
                </div>

                {/* Price */}
                <div className="pt-2">
                    <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                </div>
            </div>
        </div>
    );
}



// Alternative: Enhanced Loading Card Component
export function EnhancedLoadingCard() {
    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />

            <div className="relative">
                {/* Image placeholder */}
                <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
                </div>

                {/* Content placeholder */}
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Title placeholder */}
                    <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

                    {/* Description placeholder */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    </div>

                    {/* Footer placeholder */}
                    <div className="flex justify-between items-center pt-2">
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                        <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/5 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Floating dots animation */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}