import { fetchLocationDetail, fetchLocationReviews } from "@/actions/actions"
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import Description from "@/components/location/Description"
import ImageContainer from "@/components/location/ImageContainer"
import ShareButton from "@/components/location/ShareButton"
import ReviewSection from "@/components/location/ReviewSection"
import MapLocation from "@/components/map/MapLocation"
import { redirect } from "next/navigation"
import { notFound } from 'next/navigation'

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

        return (
            <section className="max-w-7xl mx-auto px-4 py-8">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Locations', href: '/locations' },
                        { label: location.name },
                    ]}
                />

                <header className="flex justify-between mt-4 items-center">
                    <h1 className="text-3xl font-bold">
                        {location.name}
                    </h1>
                    {/* {location.description} */}

                    <div className="flex items-center gap-x-4">
                        <ShareButton locationId={location.id} name={location.name} />
                        <FavoriteToggleButton locationId={location.id} initialIsFavorite={location.isFavorite} />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <div>
                        <ImageContainer
                            mainImage={location.image}
                            name={location.name}
                        />
                        <Description description={location.description} />
                    </div>
                    <div>
                        <MapLocation location={{
                            lat: location.lat,
                            lng: location.lng
                        }} />
                    </div>
                </div>

                <ReviewSection
                    locationId={location.id}
                    reviews={reviews}
                />
            </section>
        )
    } catch (error) {
        console.error('Error in LocationDetail:', error)
        throw error
    }
}

export default LocationDetail