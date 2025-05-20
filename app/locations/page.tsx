import { fetchLocation } from "@/actions/actions"
import LocationList from "@/components/home/LocationList"
import CategoryListAll from "@/components/home/CategoryListAll"
import { Suspense } from "react"
import LoadingCard from "@/components/card/LoadingCard"
import LocationListAll from "@/components/home/LocationListAll"

export default async function LocationsPage({
  searchParams
}: {
  searchParams: { search?: string, category?: string }
}) {
  const { search, category } = searchParams
  const locations = await fetchLocation({ search, category })




  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold relative inline-block">
          สถานที่ท่องเที่ยวทั้งหมด
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto">
          ค้นพบสถานที่ท่องเที่ยวทั้งหมดในจังหวัดบุรีรัมย์ พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
        </p>
      </div>

      <CategoryListAll />
      
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      }>
        <LocationListAll Locations={locations} />
      </Suspense>
    </div>
  )
}