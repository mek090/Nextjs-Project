import { fetchLocation } from "@/actions/actions"
import LocationList from "@/components/home/LocationList"
import CategoryListAll from "@/components/home/CategoryListAll"
import { Suspense } from "react"
import LoadingCard from "@/components/card/LoadingCard"
import LocationListAll from "@/components/home/LocationListAll"
import SearchLocation from "@/components/location/SearchLocation"
import { MapPin, Mountain, Calendar, Camera, Search } from "lucide-react"

export default async function LocationsPage({
  searchParams
}: {
  searchParams: { search?: string, category?: string }
}) {
  const { search, category } = searchParams;
  const locations = await fetchLocation({ search, category })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center space-y-6">
            {/* Main Title with Icon */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl pt-6 sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                สถานที่ท่องเที่ยวทั้งหมด
              </h1>
            </div>
            
            {/* Subtitle with decorative elements */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                ค้นพบสถานที่ท่องเที่ยวทั้งหมดในจังหวัด
                <span className="font-semibold text-blue-600 mx-2">บุรีรัมย์</span>
                พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
              </p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Search Component */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                ค้นหาสถานที่
              </h3>
              <SearchLocation />
            </div>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">หมวดหมู่</h3>
              <CategoryListAll />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {search || category ? 'ผลการค้นหา' : 'สถานที่ท่องเที่ยวทั้งหมด'}
              </h2>
              {(search || category) && (
                <p className="text-gray-600 mt-1">
                  {search && `ค้นหา: "${search}"`}
                  {search && category && ' • '}
                  {category && `หมวดหมู่: ${category}`}
                </p>
              )}
            </div>
          </div>

          {/* Location Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <LocationListAll Locations={locations} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}