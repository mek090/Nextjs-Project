// "use client";

// import { fetchLocation } from "@/actions/actions"
// import { useState, useEffect } from "react"
// import { LocationCardProps } from "@/utils/types"
// import { useSearchParams } from "next/navigation";
// import { string } from "zod";

// import LocationList from "./LocationList"
// import LoadingCard from "../card/LoadingCard"
// import Hero from "../hero/Hero";
// import CategoryList from "./CategoryList";
// import EmptyList from "./EmptyList";
// import { Search } from "lucide-react";
// import RecommendedLocations from "./RecommendedLocations";


// interface LocationContainerProps {
//     search?: string;
//     category?: string;
// }


// const LocationContainer = ({ search = '', category = '' }: LocationContainerProps) => {
//     const [locations, setLocations] = useState<LocationCardProps[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     // const searchParams = useSearchParams();
//     // const search = searchParams.get('search') || '';
//     // const category = searchParams.get('category') || '';

//     useEffect(() => {
//         const loadLocations = async () => {
//             try {
//                 setIsLoading(true)
//                 const data = await fetchLocation({ search, category })
//                 setLocations(data)
//             } catch (error) {
//                 console.error("Failed to fetch locations:", error)
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         loadLocations()
//     }, [search, category])

//     return (
//         // <div>
//         //     <Hero locations={locations} />
//         //     <CategoryList />
//         //     {isLoading ? (
//         //         <section className="py-10">
//         //             <div className="container mx-auto px-4">
//         //                 <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6">
//         //                     {[...Array(4)].map((_, index) => (
//         //                         <LoadingCard key={index} />
//         //                     ))}
//         //                 </div>
//         //             </div>
//         //         </section>
//         //     ) : locations.length === 0 ? (
//         //         <EmptyList heading="ไม่พบสถานที่ที่คุณค้นหา" />
//         //     ) : (
//         //         <LocationList Locations={locations} />
//         //     )}
//         // </div>
//         <div>
//             <Hero locations={locations} />
//             <CategoryList />
//             {isLoading ? (
//                 <section className="py-10">
//                     <div className="container mx-auto px-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6">
//                             {[...Array(4)].map((_, index) => (
//                                 <LoadingCard key={index} />
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//             ) : locations.length === 0 ? (
//                 <EmptyList heading="ไม่พบสถานที่ที่คุณค้นหา" />
//             ) : (
//                 <LocationList Locations={locations} />
//             )}
//             <RecommendedLocations />
//         </div>
//     )
// }

// export default LocationContainer


"use client";
import { fetchLocation } from "@/actions/actions"
import { useState, useEffect } from "react"
import { LocationCardProps } from "@/utils/types"
import { useSearchParams } from "next/navigation";
import { string } from "zod";
import LocationList from "./LocationList"
import LoadingCard from "../card/LoadingCard"
import Hero from "../hero/Hero";
import CategoryList from "./CategoryList";
import EmptyList from "./EmptyList";
import { Search, MapPin, Sparkles, TrendingUp, Filter } from "lucide-react";
import RecommendedLocations from "./RecommendedLocations";

interface LocationContainerProps {
    search?: string;
    category?: string;
}

const LocationContainer = ({ search = '', category = '' }: LocationContainerProps) => {
    const [locations, setLocations] = useState<LocationCardProps[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadLocations = async () => {
            try {
                setIsLoading(true)
                const data = await fetchLocation({ search, category })
                setLocations(data)
            } catch (error) {
                console.error("Failed to fetch locations:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadLocations()
    }, [search, category])

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative">
                <Hero locations={locations} />
                
                {/* Floating Stats */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 px-6 py-3">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-blue-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">{locations.length}</span>
                        <span className="text-gray-600">สถานที่</span>
                      </div>
                      {search && (
                        <div className="flex items-center gap-2 text-purple-600">
                          <Search className="w-4 h-4" />
                          <span className="font-medium">"{search}"</span>
                        </div>
                      )}
                      {category && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Filter className="w-4 h-4" />
                          <span className="font-medium">{category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            </div>

            {/* Category Filter Section */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Filter className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        เลือกหมวดหมู่ที่สนใจ
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                </div>
                <CategoryList />
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center p-6 justify-between">
                    <div className="flex items-center gap-3 ">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div >
                            <h3 className="text-xl font-bold text-gray-800">
                                {search || category ? 'ผลการค้นหา' : 'สถานที่ยอดนิยม'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isLoading ? 'กำลังโหลด...' : `พบ ${locations.length} สถานที่`}
                            </p>
                        </div>
                    </div>
                    
                    {!isLoading && locations.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span>อัพเดทล่าสุด</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="space-y-4">
                                    <div className="animate-pulse">
                                        <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <EmptyList heading="ไม่พบสถานที่ที่คุณค้นหา" />
                            <p className="text-gray-500">
                                ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ที่แตกต่างออกไป
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <LocationList Locations={locations} />
                    </div>
                )}
            </div>

            {/* Recommended Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        แนะนำพิเศษสำหรับคุณ
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-200 to-transparent"></div>
                </div>
                <RecommendedLocations />
            </div>
        </div>
    )
}

export default LocationContainer