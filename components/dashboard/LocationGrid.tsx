import { MapPin } from "lucide-react"
import LocationCard from "./LocationCard"

interface Location {
  id: string
  name: string
  description: string
  image: string[]
  districts: string
  openTime?: string
  closeTime?: string
  locations?: string[]
}

interface LocationGridProps {
  locations: Location[]
}

export default function LocationGrid({ locations }: LocationGridProps) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          ไม่พบสถานที่
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          ลองค้นหาด้วยคำอื่น หรือเพิ่มสถานที่ใหม่
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  )
}