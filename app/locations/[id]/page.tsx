import { fetchLocationDetail, fetchLocationReviews } from "@/actions/actions"
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import Description from "@/components/location/Description"
import DescriptionAI from "@/components/location/DescriptionAI"
import ImageContainer from "@/components/location/ImageContainer"
import ShareButton from "@/components/location/ShareButton"
import ReviewSection from "@/components/location/ReviewSection"
import MapLocation from "@/components/map/MapLocation"
import LocationChatBot from "@/components/location/LocationChatBot"
import { notFound } from 'next/navigation'
import { MapPin, Star, Clock, Phone, Globe, HandCoins } from 'lucide-react'

const LocationDetail = async ({ params }: { params: { id: string } }) => {
    try {
        const { id } = params
        console.log('Fetching location with ID:', id)
        const location = await fetchLocationDetail({ id })
        console.log('Location data:', location)

        if (!location) {
            console.log('Location not found, redirecting to home')
            notFound()
        }

        const reviews = await fetchLocationReviews(id)
        console.log('Reviews data:', JSON.stringify(reviews, null, 2))

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : "0.0";

        return (
            <section className="max-w-7xl mx-auto px-4 py-6  min-h-screen">
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
                        <div className="absolute w-full h-full bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <div className="h-64 md:h-96">
                            <ImageContainer
                                mainImage={location.image}
                                name={location.name}
                            />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 z-20">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <h1 className="text-4xl text-white md:text-5xl font-bold  drop-shadow-md">
                                    {location.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center">
                                        <Star className="text-yellow-400 mr-1" size={20} />
                                        <span className=" font-semibold">{avgRating}</span>
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
                    <div className=" rounded-xl shadow-md p-4 mb-8 flex flex-wrap gap-4 justify-between">
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
                            <HandCoins  className="text-blue-500 mr-2" size={20} />
                            <p className="mr-2">ค่าใช้จ่าย</p>
                            <span className="font-medium">{location.price || 'ไม่ได้ระบุข้อมูล'}</span>
                            <p className="mx-2">บาท</p>
                        </div>
                        {/* <div className="flex items-center">
                        <Globe className="text-blue-500 mr-2" size={20} />
                        <span className="font-medium text-blue-600">เว็บไซต์</span>
                    </div> */}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Left Column (Description) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    เกี่ยวกับสถานที่
                                </h2>
                                <Description description={location.description} />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 overflow-hidden">
                                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    AI แนะนำสถานที่
                                </h2>
                                <DescriptionAI
                                    locationName={location.name}
                                    locationDescription={location.description}
                                    locationDistrict={location.districts}
                                />
                            </div>
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
                            </div>

                            {/* Location Images Grid */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    รูปภาพเพิ่มเติม
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {Array(4).fill(0).map((_, index) => (
                                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                                            {/* Placeholder for additional images */}
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                รูปที่ {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            รีวิวจากผู้ใช้
                        </h2>
                        <ReviewSection
                            locationId={location.id}
                            reviews={reviews}
                        />
                    </div>

                    {/* Chatbot Section
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            สอบถามข้อมูลเพิ่มเติม
                        </h2>
                        <p className="text-gray-600 mb-6">
                            มีคำถามเกี่ยวกับสถานที่นี้? แชทกับ AI ของเราเพื่อขอข้อมูลเพิ่มเติม
                        </p>
                        
                    </div> */}
                    <LocationChatBot
                        locationName={location.name}
                        locationDescription={location.description}
                        locationDistrict={location.districts}
                    />

                    {/* Related Locations */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                            สถานที่ใกล้เคียงที่น่าสนใจ
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array(4).fill(0).map((_, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                                    <h3 className="font-semibold">สถานที่แนะนำ {index + 1}</h3>
                                    <p className="text-gray-500 text-sm">ห่างออกไป 2.5 กม.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    } catch (error) {
        console.error('Error in LocationDetail:', error)
        throw error
    }
}

export default LocationDetail