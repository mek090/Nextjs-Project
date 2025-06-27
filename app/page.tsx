import LocationContainer from "@/components/home/LocationContainer"
import Weatherapi from "@/components/weather/Weather"
import BuriramChatBotOverlay from "./chat/page"
import { Suspense } from "react"
import LoadingCard from "@/components/card/LoadingCard"
import Search from "@/components/Navbar/Search"
import { Star, MapPin, Clock, Heart, Globe, Camera, Mountain, Compass } from "lucide-react"
import TouristMapClient from '@/components/map/TouristMapClient';

const page = async (props: any) => {
  const resolvedProps = await Promise.resolve(props);
  const searchParams = await resolvedProps.searchParams as { search?: string, category?: string } | undefined;
  const search = searchParams?.search;
  const category = searchParams?.category;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section with Floating Elements */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-teal-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-teal-900/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23007BFF%22 fill-opacity=%220.05%22/%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Floating Icons - Responsive positioning */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-4 sm:top-20 sm:left-10 animate-float">
            <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-green-400/30" />
          </div>
          <div className="absolute top-24 right-8 sm:top-32 sm:right-20 animate-float-delayed">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/30" />
          </div>
          <div className="absolute bottom-32 left-8 sm:bottom-40 sm:left-20 animate-bounce-slow">
            <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400/30" />
          </div>
          <div className="absolute top-32 right-16 sm:top-40 sm:right-40 animate-pulse">
            <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400/30" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Search Section */}
          <div className="mb-8 sm:mb-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Search />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-6 sm:space-y-8 relative z-10">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent px-2 sm:px-0 leading-tight">
                  สถานที่ท่องเที่ยวแนะนำ
                </h2>
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
              </div>
              
              {/* Decorative Line */}
              <div className="flex items-center justify-center">
                <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
              </div>
            </div>
            
            {/* Description */}
            <div className="max-w-3xl mx-auto px-4 sm:px-0">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
                ค้นพบสถานที่ท่องเที่ยวยอดนิยมที่คุณ
                <span className="text-blue-600 font-semibold mx-1 sm:mx-2">ไม่ควรพลาด</span>
                พร้อมข้อมูลครบถ้วนสำหรับการวางแผนทริปของคุณ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot - Responsive positioning */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <BuriramChatBotOverlay />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 relative z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/60 overflow-hidden">
          <Suspense fallback={
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:overflow-x-auto gap-4 sm:gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-full sm:min-w-[280px] md:min-w-[300px]">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/60 overflow-hidden">
          <Weatherapi />
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                คู่มือท่องเที่ยว
              </h3>
            </div>

            {/* Copyright */}
            <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 px-4 sm:px-0">
              &copy; 2025 คู่มือท่องเที่ยว | ออกแบบสำหรับนักสำรวจ
            </p>

            {/* Links - Responsive layout */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6">
              {[
                { label: 'เงื่อนไขการใช้งาน', href: '#' },
                { label: 'นโยบายความเป็นส่วนตัว', href: '#' },
                { label: 'ติดต่อเรา', href: '#' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group relative px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-gray-400">Made with ❤️ CS65</span>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default page