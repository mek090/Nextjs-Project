import LocationContainer from "@/components/home/LocationContainer"
import Weatherapi from "@/components/weather/Weather"
import BuriramChatBotOverlay from "./chat/page"
import { Suspense } from "react"
import LoadingCard from "@/components/card/LoadingCard"



const page = async ({
  searchParams
}: {
  searchParams:
  { search?: string, category?: string }
}) => {

  const { search, category } = await searchParams

  // console.log(search);


  return (
    <>


      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold relative inline-block">
          สถานที่ท่องเที่ยวแนะนำ
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
        </h2>
        <p className="mt-4  max-w-2xl mx-auto">
          ค้นพบสถานที่ท่องเที่ยวยอดนิยมที่คุณไม่ควรพลาด พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
        </p>
      </div>

      <div>
        <BuriramChatBotOverlay />
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4">
        <Suspense fallback={
          <div className="flex overflow-x-auto p-4 gap-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        }>
          <LocationContainer search={search} category={category} />
        </Suspense>
      </div>

      {/* weather */}
      <Weatherapi />


      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-teal-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-center">
            &copy; 2025 คู่มือท่องเที่ยว | ออกแบบสำหรับนักสำรวจ
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-teal-300 transition">เงื่อนไขการใช้งาน</a>
            <a href="#" className="hover:text-teal-300 transition">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-teal-300 transition">ติดต่อเรา</a>
          </div>
        </div>
      </footer>
    </>
  )
}
export default page