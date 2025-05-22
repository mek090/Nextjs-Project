'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Review {
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

interface PlaceDetails {
    name: string;
    formatted_address: string;
    photos?: Array<{
        photo_reference: string;
    }>;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
        open_now?: boolean;
        weekday_text?: string[];
    };
    business_status?: string;
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
    reviews?: Review[];
}

export default function PlaceDetailsPage() {
    const params = useParams();
    const placeId = params?.id as string;

    const [place, setPlace] = useState<PlaceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const response = await fetch(`/api/places/details?place_id=${placeId}`);
                const data = await response.json();
                setPlace(data.result);
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
            setLoading(false);
        };

        if (placeId) {
            fetchPlaceDetails();
        }

    }, [placeId]);

    const nextPhoto = () => {
        if (place?.photos) {
            setCurrentPhotoIndex((prev) => (prev + 1) % place.photos!.length);
        }
    };

    const prevPhoto = () => {
        if (place?.photos) {
            setCurrentPhotoIndex((prev) => (prev - 1 + place.photos!.length) % place.photos!.length);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูลสถานที่
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/dashboard/places" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับไปหน้ารายการ
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {place.photos && place.photos.length > 0 && (
                    <div className="relative">
                        <div className="relative h-96">
                            <Image
                                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${place.photos[currentPhotoIndex].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                                alt={`${place.name} - รูปที่ ${currentPhotoIndex + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Navigation Buttons */}
                        {place.photos.length > 1 && (
                            <>
                                <button
                                    onClick={prevPhoto}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    aria-label="รูปก่อนหน้า"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextPhoto}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    aria-label="รูปถัดไป"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Photo Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentPhotoIndex + 1} / {place.photos.length}
                        </div>

                        {/* Thumbnail Navigation */}
                        {place.photos.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                                {place.photos.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPhotoIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                        aria-label={`ไปที่รูปที่ ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{place.name}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">ข้อมูลสถานที่</h2>
                            <p className="text-gray-600 mb-4">{place.formatted_address}</p>

                            {place.rating && (
                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-400 text-xl">★</span>
                                    <span className="ml-2 text-lg">{place.rating.toFixed(1)}</span>
                                    {place.user_ratings_total && (
                                        <span className="ml-2 text-gray-500">
                                            ({place.user_ratings_total} รีวิว)
                                        </span>
                                    )}
                                </div>
                            )}

                            {place.business_status && (
                                <p className="mb-4">
                                    สถานะ: {place.business_status === 'OPERATIONAL' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
                                </p>
                            )}
                        </div>

                        {place.opening_hours && (
                            <div>
                                <h2 className="text-xl font-semibold mb-2">เวลาทำการ</h2>
                                {place.opening_hours.open_now !== undefined && (
                                    <p className="mb-4">
                                        สถานะ: {place.opening_hours.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                                    </p>
                                )}
                                {place.opening_hours.weekday_text && (
                                    <ul className="space-y-1">
                                        {place.opening_hours.weekday_text.map((text, index) => (
                                            <li key={index} className="text-gray-600">{text}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    {place.reviews && place.reviews.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">รีวิวจากผู้ใช้</h2>
                            <div className="space-y-6">
                                {place.reviews.map((review, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                                        <div className="flex items-center mb-3">
                                            <Image
                                                src={review.profile_photo_url}
                                                alt={review.author_name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div className="ml-3">
                                                <a
                                                    href={review.author_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-semibold hover:underline"
                                                >
                                                    {review.author_name}
                                                </a>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="text-yellow-400 mr-1">★</span>
                                                    <span>{review.rating}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{review.relative_time_description}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-line">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {place.geometry && (
                        <div className="mt-6">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                ดูใน Google Maps
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 