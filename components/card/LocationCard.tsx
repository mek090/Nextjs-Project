"use client";

import Image from "next/image";
import Link from "next/link";
import { LocationCardProps } from "@/utils/types";
import LocationRating from "./LocationRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import LoadingCard from "./LoadingCard";
import { fetchLocationDetail } from "@/actions/actions";
import ShareButton from "../location/ShareButton";
import { MapPin, Pin } from "lucide-react";
import { Button } from "../ui/button";



// export async function generateMetadata(
//     parent: any
// ) {
//     const { params } = await parent;
//     const id = await params.id;
//     const location = await fetchLocationDetail({ id });
//     return {
//         title: location ? `${location.name} - Location Detail` : 'Location Detail',
//     }
// }





// คอมโพเนนต์การ์ดแสดงสถานที่
const LocationCard = ({
    Location,
    onShare,
    onReview,
    isAlreadyFavorite = false,
    isLoading = false
}: {
    Location: LocationCardProps,
    onShare?: (id: string) => void,
    onReview?: (id: string) => void,
    isAlreadyFavorite?: boolean,
    isLoading?: boolean
}) => {
    if (isLoading) {
        return <LoadingCard />;
    }

    const {
        id,
        name,
        image,
        description,
        districts,
        price,
        rating,
        openTime,
        closeTime,
    } = Location;

    // Format price display for better readability
    const formatPrice = (price: string | number): string => {
        const num = typeof price === 'string' ? Number(price) : price;

        if (isNaN(num)) return `${price}`;

        if (num === 0) return 'ไม่มีค่าใช้จ่าย';
        if (num < 1000) return `${num} บาท`;
        return `${(num / 1000).toFixed(1)}K บาท`;
    };

    // ฟังก์ชันเลือกภาพที่ไม่ใช่ Google API
    // const getValidImage = (images: string[] | string) => {
    //     if (!images) return "/placeholder.jpg";
    //     if (typeof images === "string") {
    //         return images.includes("maps.googleapis.com") ? "/placeholder.jpg" : images;
    //     }
    //     // ถ้าเป็น array
    //     const valid = images.find(img => !img.includes("maps.googleapis.com"));
    //     return valid || "/placeholder.jpg";
    // };


    return (
        <article className="bg-gray-50 dark:bg-gray-700 group relative h-full rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image with subtle overlay effect */}
            <div className="relative w-full h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 overflow-hidden">
                <Link href={`/locations/${id}`}>
                    {/* <Image
                        src={Array.isArray(location.image) ? location.image[0] : location.image}
                        alt={location.name}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    /> */}

                    <Image
                        src={Array.isArray(image) ? image[0] : image}
                        alt={name}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        priority={false}
                    />

                    {/* Simple gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Rating badge */}
                    {rating && (
                        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-white dark:bg-black px-1 sm:px-1.5 md:px-2 py-0.5 rounded-md flex items-center shadow-sm">
                            <LocationRating rating={Math.round(rating)} size={2} />
                            <span className="font-semibold text-gray-800 text-xs sm:text-sm dark:text-gray-300 ml-0.5 sm:ml-1">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Price tag */}
                    {price !== undefined && (
                        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-blue-500 text-white px-1 sm:px-1.5 md:px-2 py-0.5 rounded-md text-xs font-medium">
                            {formatPrice(price)}
                        </div>
                    )}
                </Link>
            </div>

            {/* Card content */}
            <div className="p-2 sm:p-2.5 md:p-3">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300 dark:text-gray-200">
                    {name}
                </h3>
                <p className="text-gray-600 mt-0.5 sm:mt-1 line-clamp-2 text-xs sm:text-sm h-6 sm:h-8 md:h-10 dark:text-gray-400">
                    {description}
                </p>
                <div className="mt-1.5 sm:mt-2 flex items-center text-xs text-gray-500 dark:text-gray-300">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mr-0.5 sm:mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{districts}</span>
                </div>

                {openTime && closeTime && (
                    <div className="mt-0.5 sm:mt-1 flex items-center text-xs text-gray-500 dark:text-gray-300">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mr-0.5 sm:mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{openTime} - {closeTime}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-2 sm:mt-2.5 md:mt-3 grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
                    {/* Details Button (Primary) */}
                    <Link
                        href={`/locations/${id}`}
                        className="col-span-4 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-1.5 sm:py-2 px-1.5 sm:px-2 md:px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium dark:text-white"
                    >
                        <span>ดูรายละเอียด</span>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ml-0.5 sm:ml-1 md:ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>

                    {/* Favorite Button */}
                    <FavoriteToggleButton
                        locationId={id}
                        initialIsFavorite={isAlreadyFavorite}
                    />

                    {/* Map/Navigate Button */}
                    <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${Location.lat},${Location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 hover:bg-gray-50 text-gray-700 py-1.5 px-1.5 sm:px-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                        aria-label="แผนที่"
                    >
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 dark:text-white" />
                    </Link>

                    <ShareButton locationId={Location.id} name={Location.name} />
                </div>
            </div>
        </article>
    );
};

export default LocationCard;

