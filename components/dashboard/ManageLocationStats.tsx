import { MapPin, TrendingUp } from "lucide-react"

interface ManageLocationStatsProps {
  locationCount: number
}

export default function ManageLocationStats({ locationCount }: ManageLocationStatsProps) {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="grid">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">สถานที่ทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{locationCount}</p>
          </div>
        </div>
      </div>
      
      {/* <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">สถานะ</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">ใช้งานได้</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">อัพเดทล่าสุด</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">วันนี้</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}