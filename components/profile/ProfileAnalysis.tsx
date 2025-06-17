"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Heart, BarChart2, Loader2, Clock, Award } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';

interface ProfileAnalysisProps {
    userId: string;
}

interface AnalysisData {
    totalReviews: number;
    totalFavorites: number;
    averageRating: string;
    favoriteCategory: string;
    favoriteDistrict: string;
    categoryBreakdown: Record<string, number>;
    districtBreakdown: Record<string, number>;
    recentReviews: Array<{
        id: string;
        content: string;
        rating: number;
        createdAt: string;
        location: {
            id: string;
            name: string;
            image: string;
        };
    }>;
    favoriteLocations: Array<{
        id: string;
        name: string;
        image: string;
    }>;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfileAnalysis({ userId }: ProfileAnalysisProps) {
    const { data: analysis, error, isLoading } = useSWR<AnalysisData>(
        `/api/profile/analysis?userId=${userId}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000, // Cache for 1 minute
        }
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">กำลังวิเคราะห์ข้อมูล...</p>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-lg text-gray-600 dark:text-gray-300">ไม่พบข้อมูลการวิเคราะห์</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* สรุปภาพรวม */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">รีวิวทั้งหมด</CardTitle>
                        <Star className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analysis.totalReviews}</div>
                        <div className="flex items-center mt-2">
                            <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < parseInt(analysis.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">เฉลี่ย {analysis.averageRating}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 dark:border-pink-700 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">สถานที่โปรด</CardTitle>
                        <Heart className="h-5 w-5 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">{analysis.totalFavorites}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">สถานที่ที่บันทึกไว้</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 dark:border-purple-700 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">ประเภทที่ชอบ</CardTitle>
                        <Award className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{analysis.favoriteCategory}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">ประเภทที่เพิ่มเป็นสถานที่โปรดมากที่สุด</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-700 hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">อำเภอที่ชอบ</CardTitle>
                        <MapPin className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300">{analysis.favoriteDistrict}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">อำเภอที่เพิ่มเป็นสถานที่โปรดมากที่สุด</p>
                    </CardContent>
                </Card>
            </div>

            {/* รีวิวล่าสุด */}
            <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden border-t-4 border-t-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                        <Clock className="mr-2 h-5 w-5" />
                        รีวิวล่าสุด
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6 divide-y divide-gray-100 dark:divide-gray-700">
                        {analysis.recentReviews.map((review) => (
                            <div key={review.id} className="flex items-start space-x-4 pt-4 first:pt-0">
                                <Link href={`/locations/${review.location.id}`} className="flex-shrink-0 transform transition-transform hover:scale-105 duration-200">
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg shadow-md">
                                        <Image
                                            src={review.location.image[0]}
                                            alt={review.location.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Link>
                                <div className="flex-1">
                                    <Link
                                        href={`/locations/${review.location.id}`}
                                        className="font-medium text-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        {review.location.name}
                                    </Link>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString("th-TH", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{review.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* สถานที่โปรด */}
            <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden border-t-4 border-t-pink-500">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-800">
                    <CardTitle className="flex items-center text-pink-700 dark:text-pink-300">
                        <Heart className="mr-2 h-5 w-5" />
                        สถานที่โปรด
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analysis.favoriteLocations.map((location) => (
                            <Link
                                key={location.id}
                                href={`/locations/${location.id}`}
                                className="group transform transition-all hover:scale-105 duration-200"
                            >
                                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={location.image[0]}
                                        alt={location.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="text-white font-medium text-lg group-hover:text-pink-200 transition-colors duration-200">
                                            {location.name}
                                        </h3>
                                        <div className="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                            <Heart className="w-4 h-4 text-pink-400 mr-1" fill="currentColor" />
                                            <span className="text-pink-100 text-sm">สถานที่โปรด</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}