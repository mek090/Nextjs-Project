import { fetchLocationDetail, fetchLocationReviews } from "@/actions/actions"
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import CollapsibleSection from "@/components/location/CollapsibleSection"
import ImageContainer from "@/components/location/ImageContainer"
import ShareButton from "@/components/location/ShareButton"
import ReviewSection from "@/components/location/ReviewSection"
import MapLocation from "@/components/map/MapLocation"
import LocationChatBot from "@/components/location/LocationChatBot"
import { notFound } from 'next/navigation'
import { MapPin, Star, Clock, Phone, Globe, HandCoins, X, Pin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useState } from "react"
import ImageGrid from '@/components/location/ImageGrid'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic";
import HeroImageSectionWrapper from "./HeroImageSectionWrapper"




// ImageModal Component
// const ImageModal = ({ image, onClose }: { image: string; onClose: () => void }) => {
//     return (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
//             <div className="relative max-w-4xl w-full h-[80vh]">
//                 <button
//                     onClick={onClose}
//                     className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
//                 >
//                     <X size={32} />
//                 </button>
//                 <div className="relative w-full h-full">
//                     <Image
//                         src={image}
//                         alt="Location image"
//                         fill
//                         className="object-contain"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// เพิ่ม generateMetadata function
export async function generateMetadata(
    parent: any
) {
    const { params } = await parent;
    const id = await params.id;
    const location = await fetchLocationDetail({ id });
    return {
        title: location ? `${location.name} - Location Detail` : 'Location Detail',
    }
}

// เพิ่ม generateStaticParams function
export async function generateStaticParams() {
    return [];
}

export default async function LocationDetail(props: any) {
    const resolvedProps = await Promise.resolve(props);
    const params = resolvedProps.params as { id: string };
    try {
        const id = params.id;

        // ใช้ Promise.all เพื่อรอให้ params พร้อมใช้งาน
        const [location, reviews] = await Promise.all([
            fetchLocationDetail({ id }),
            fetchLocationReviews(id)
        ]);

        console.log('Location data:', location);

        if (!location) {
            console.log('Location not found, redirecting to home')
            notFound()
        }

        console.log('Reviews data:', JSON.stringify(reviews, null, 2))

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : "0.0";

        // Convert dates to strings
        const formattedReviews = reviews.map(review => ({
            ...review,
            createdAt: review.createdAt.toISOString(),
            replies: review.replies.map(reply => ({
                ...reply,
                createAt: reply.createAt.toISOString()
            }))
        }));




        return (
            <section className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Locations', href: '/locations' },
                        { label: location.name },
                    ]}
                />
                <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">

                    {/* Hero Section */}
                    <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
                        {/* <div className="absolute w-full h-full bg-gradient-to-t from-black/70 to-transparent z-10"></div> */}
                        <div className="h-[500px] md:h-[550px]">
                            <div className="relative w-full h-full mb-4">
                                <HeroImageSectionWrapper images={Array.isArray(location.image) ? location.image : [location.image]} alt={location.name} />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <h1 className="text-4xl text-white md:text-5xl font-bold drop-shadow-md">
                                    {location.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center">
                                        <Star className="text-yellow-400 mr-1" size={20} />
                                        <span className="font-semibold">{avgRating}</span>
                                    </div>
                                    <div className="bg dark:bg-gray-800">
                                        <ShareButton locationId={location.id} name={location.name} />
                                    </div>
                                    <FavoriteToggleButton locationId={location.id} initialIsFavorite={location.isFavorite} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="rounded-xl shadow-md p-4 mb-8 flex flex-wrap gap-4 justify-between">
                        <div className="flex items-center">
                            <MapPin className="text-blue-500 mr-2" size={20} />
                            <span className="font-medium">{location.districts || 'ไม่ได้ระบุข้อมูล'}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="text-blue-500 mr-2" size={20} />
                            <span className="font-medium">{location.openTime || 'ไม่ได้ระบุข้อมูล'}</span>
                            <p className="mx-2"> - </p>
                            <span className="font-medium">{location.closeTime || 'ไม่ได้ระบุข้อมูล'}</span>
                        </div>
                        <div className="flex items-center">
                            <HandCoins className="text-blue-500 mr-2" size={20} />
                            <p className="mr-2">ค่าใช้จ่าย</p>
                            <span className="font-medium">{location.price || 'ไม่ได้ระบุข้อมูล'}</span>
                            {/* <p className="mx-2">บาท</p> */}
                        </div>
                    </div>

                    {/* Tabbed Content - Main Interface */}
                    <Tabs defaultValue="info" className="mb-8">
                        {/* <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="info">ข้อมูลสถานที่</TabsTrigger>
                            <TabsTrigger value="reviews">รีวิวจากผู้ใช้ ({reviews.length})</TabsTrigger>
                            <TabsTrigger value="nearby">สถานที่ใกล้เคียง</TabsTrigger>
                        </TabsList> */}

                        {/* Info Tab Content */}
                        <TabsContent value="info" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column (Description) */}
                                <div className="lg:col-span-2 space-y-6">
                                    <CollapsibleSection
                                        title="เกี่ยวกับสถานที่"
                                        content={location.description}

                                        type="description"
                                    />

                                    <CollapsibleSection
                                        title="AI แนะนำสถานที่"
                                        locationName={location.name}
                                        locationDescription={location.description}
                                        locationDistrict={location.districts}
                                        locationCategory={location.category}
                                        locationLat={location.lat}
                                        locationLng={location.lng}
                                        type="ai-description"
                                    />
                                </div>

                                {/* Right Column (Map) */}
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                            แผนที่
                                        </h2>
                                        <div className="h-64 md:h-80 rounded-lg overflow-hidden">
                                            <MapLocation location={{
                                                lat: location.lat,
                                                lng: location.lng
                                            }} />
                                        </div>
                                        {/* go to map */}
                                        <Button variant="default" className="mt-4 w-full" size="lg">
                                            <Link
                                                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Pin className="mr-1" />
                                                    ดูใน Google Maps
                                                </div>

                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Location Images Grid */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                            รูปภาพสถานที่
                                        </h2>
                                        <ImageGrid
                                            images={typeof location.image === 'string' ? [] : location.image.slice(0)}
                                            locationName={location.name}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Tab */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    รีวิวจากผู้ใช้
                                </h2>
                                <ReviewSection
                                    locationId={location.id}
                                    reviews={formattedReviews}
                                />
                            </div>



                            <LocationChatBot
                                locationName={location.name}
                                locationDescription={location.description}
                                locationDistrict={location.districts}
                            />
                        </TabsContent>


                    </Tabs>
                </div>
            </section>
        )
    } catch (error) {
        console.error('Error in LocationDetail:', error)
        notFound()
    }
}


