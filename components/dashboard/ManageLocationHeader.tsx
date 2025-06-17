import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import SearchManageLocation from "./SearchManageLocation"

export default function ManageLocationHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
              จัดการสถานที่ท่องเที่ยว
            </h1>
            <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
              เพิ่ม แก้ไข และจัดการสถานที่ท่องเที่ยวทั้งหมด
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchManageLocation />
          <div className="flex gap-2">
            <Link href="/dashboard/places">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มจาก Google Places
              </Button>
            </Link>
            <Link href="/locations/create">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มสถานที่ใหม่
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}