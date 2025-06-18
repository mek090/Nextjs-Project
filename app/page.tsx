// import LocationContainer from "@/components/home/LocationContainer"
// import Weatherapi from "@/components/weather/Weather"
// import BuriramChatBotOverlay from "./chat/page"
// import { Suspense } from "react"
// import LoadingCard from "@/components/card/LoadingCard"
// import Bot from "@/components/ChatYimm/bot"
// import MapLocation from "@/components/map/MapLocation"
// import Search from "@/components/Navbar/Search"



// const page = async ({
//   searchParams
// }: {
//   searchParams:
//   { search?: string, category?: string }
// }) => {

//   const { search, category } = await searchParams

//   // console.log(search);


//   return (
//     <>
//       <div className="mb-8">
//         <Search />
//       </div>

//       <div className="mb-8 text-center">
//         <h2 className="text-4xl font-bold relative inline-block">
//           สถานที่ท่องเที่ยวแนะนำ
//           <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
//         </h2>
//       </div>
//       <p className="mt-4  max-w-2xl mx-auto">
//         ค้นพบสถานที่ท่องเที่ยวยอดนิยมที่คุณไม่ควรพลาด พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
//       </p>

//       <div>
//         <BuriramChatBotOverlay />
//         {/* <Bot /> */}
//       </div>

//       <div className="bg-gradient-to-br from-blue-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4">
//         <Suspense fallback={
//           <div className="flex overflow-x-auto p-4 gap-4">
//             <LoadingCard />
//             <LoadingCard />
//             <LoadingCard />
//             <LoadingCard />
//             <LoadingCard />
//           </div>
//         }>
//           <LocationContainer search={search} category={category} />
//         </Suspense>
//       </div>

//       {/* weather */}
//       <Weatherapi />

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-blue-900 to-teal-800 text-white py-8">
//         <div className="container mx-auto px-4">
//           <p className="mb-4 text-center">
//             &copy; 2025 คู่มือท่องเที่ยว | ออกแบบสำหรับนักสำรวจ
//           </p>
//           <div className="flex justify-center space-x-4">
//             <a href="#" className="hover:text-teal-300 transition">เงื่อนไขการใช้งาน</a>
//             <a href="#" className="hover:text-teal-300 transition">นโยบายความเป็นส่วนตัว</a>
//             <a href="#" className="hover:text-teal-300 transition">ติดต่อเรา</a>
//           </div>
//         </div>
//       </footer>
//     </>
//   )
// }
// export default page


import LocationContainer from "@/components/home/LocationContainer"
import Weatherapi from "@/components/weather/Weather"
import BuriramChatBotOverlay from "./chat/page"
import { Suspense } from "react"
import LoadingCard from "@/components/card/LoadingCard"
import Search from "@/components/Navbar/Search"
import { Star, MapPin, Clock, Heart, Globe, Camera, Mountain, Compass } from "lucide-react"

const page = async ({
  searchParams
}: {
  searchParams: { search?: string, category?: string }
}) => {
  const { search, category } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section with Floating Elements */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-teal-500/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23007BFF%22 fill-opacity=%220.05%22/%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Mountain className="w-8 h-8 text-green-400/30" />
          </div>
          <div className="absolute top-32 right-20 animate-float-delayed">
            <Camera className="w-6 h-6 text-purple-400/30" />
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce-slow">
            <Globe className="w-10 h-10 text-blue-400/30" />
          </div>
          <div className="absolute top-40 right-40 animate-pulse">
            <Compass className="w-7 h-7 text-indigo-400/30" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          {/* Search Section */}
          <div className="mb-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Search />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  สถานที่ท่องเที่ยวแนะนำ
                </h2>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
              </div>
            </div>
            
            {/* Description */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                ค้นพบสถานที่ท่องเที่ยวยอดนิยมที่คุณ
                <span className="text-blue-600 font-semibold mx-2">ไม่ควรพลาด</span>
                พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
              </p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <BuriramChatBotOverlay />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <Suspense fallback={
            <div className="p-8">
              <div className="flex overflow-x-auto gap-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="min-w-[300px]">
                    <LoadingCard />
                  </div>
                ))}
              </div>
            </div>
          }>
            <LocationContainer search={search} category={category} />
          </Suspense>
        </div>
      </div>

      {/* Weather Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <Weatherapi />
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                คู่มือท่องเที่ยว
              </h3>
            </div>

            {/* Copyright */}
            <p className="text-lg text-gray-300 mb-6">
              &copy; 2025 คู่มือท่องเที่ยว | ออกแบบสำหรับนักสำรวจ
            </p>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: 'เงื่อนไขการใช้งาน', href: '#' },
                { label: 'นโยบายความเป็นส่วนตัว', href: '#' },
                { label: 'ติดต่อเรา', href: '#' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Made with ❤️ CS65</span>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default page