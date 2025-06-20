"use client";

import { useEffect, useState } from "react";
import { getWeatherData } from '../../lib/fetchWeather'
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiHumidity, WiStrongWind } from "react-icons/wi";
import Bot from "../GeminiBot/Bot";
import { WeatherIcons, WeatherResponse, SysData, WindData, MainWeatherData, WeatherCondition } from "@/utils/types";
import LocationContainer from "../home/LocationContainer";
import dynamic from "next/dynamic";


// Dynamic import with no SSR
const TouristMap = dynamic(() => import('../map/TouristMap'), { ssr: false });

export default function Weatherapi() {
  // บุรีรัมย์และอำเภอสำคัญ
  const buriramDistricts = [
    "Buriram", // เมืองบุรีรัมย์
    "Nang Rong", // นางรอง
    "Prakhon Chai", // ประโคนชัย
    "Lam Plai Mat", // ลำปลายมาศ
    "Satuek" // สตึก
  ];

  const [selectedCity, setSelectedCity] = useState<string>("Buriram");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<string>("กลางวัน");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // ตรวจสอบเวลาปัจจุบัน (กลางวัน/กลางคืน)
    const currentHour = new Date().getHours();
    setTimeOfDay(currentHour >= 6 && currentHour < 18 ? "กลางวัน" : "กลางคืน");

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData(selectedCity);
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("ไม่สามารถโหลดข้อมูลสภาพอากาศได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCity]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const weatherIcons: WeatherIcons = {
    Clear: <WiDaySunny className="text-yellow-400 text-7xl" />,
    Clouds: <WiCloud className="text-gray-300 text-7xl" />,
    Rain: <WiRain className="text-blue-300 text-7xl" />,
    Snow: <WiSnow className="text-white text-7xl" />,
    Thunderstorm: <WiThunderstorm className="text-purple-400 text-7xl" />,
  };

  const googleMapsApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  // อำเภอและสถานที่ท่องเที่ยวแนะนำในบุรีรัมย์
  const touristSpots = [
    {
      name: "ปราสาทพนมรุ้ง",
      district: "Prakhon Chai",
      description: "ปราสาทขอมโบราณบนยอดภูเขาไฟที่ดับแล้ว สร้างขึ้นในพุทธศตวรรษที่ 15-16",
      image: "/images/phanom-rung.jpg"
    },
    {
      name: "อุทยานประวัติศาสตร์ปราสาทเมืองต่ำ",
      district: "Prakhon Chai",
      description: "ปราสาทขอมที่สร้างเป็นบารายน้ำ สะท้อนความเชื่อในศาสนาฮินดู",
      image: "/images/muang-tam.jpg"
    },
    {
      name: "สนามฟุตบอลช้าง อารีนา",
      district: "Buriram",
      description: "สนามฟุตบอลบุรีรัมย์ ยูไนเต็ด ที่ได้มาตรฐานระดับโลก",
      image: "/images/chang-arena.jpg"
    },
    {
      name: "ช้าง อินเตอร์เนชั่นแนล เซอร์กิต",
      district: "Buriram",
      description: "สนามแข่งรถมาตรฐานระดับโลกที่ใหญ่ที่สุดในประเทศไทย",
      image: "/images/circuit.jpg"
    }
  ];

  // กรองสถานที่ท่องเที่ยวตามอำเภอที่เลือก
  const filteredSpots = touristSpots.filter(spot =>
    spot.district === selectedCity || selectedCity === "Buriram"
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-gray-900 dark:text-white flex flex-col items-center py-4 px-4 relative"
      style={{
        backgroundImage: timeOfDay === "กลางวัน"
          ? "url('/images/buriram-bg-day.jpg')"
          : "url('/images/buriram-bg-night.jpg')",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay สำหรับทำให้ background นุ่มตา */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-900/30 pointer-events-none"></div>

      {/* Header Section - ปรับปรุงใหม่ */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl p-8 rounded-3xl mb-8 w-full shadow-2xl border border-white/20">
        <div className="text-center space-y-4">
          {/* Main Title */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-5xl animate-pulse">🏛️</div>
            <h1 className="text-4xl p-6 lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-orange-200 drop-shadow-2xl">
              ไปไหนดี? บุรีรัมย์
            </h1>
            <div className="text-5xl animate-pulse">⛅</div>
          </div>

          {/* English Subtitle */}
          <h2 className="text-xl lg:text-2xl font-semibold text-white/90 tracking-wider">
            BURIRAM LOCAL EXPERIENCE
          </h2>

          {/* Description */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-6">
            <p className="text-lg lg:text-xl text-white font-medium">
              🌟 สำรวจที่เที่ยว · เช็คสภาพอากาศ · แชทกับบอทน่ารักๆ 🌟
            </p>
            <p className="text-sm lg:text-base text-white/80 mt-2">
              รวมทุกอย่างที่ต้องรู้ก่อนไปเที่ยวบุรีรัมย์ - จากปราสาทหินถึงร้านของกินท้องถิ่น
            </p>
          </div>
        </div>
      </div>


      {/* เลือกอำเภอ - ปรับปรุงใหม่ */}
      <div className="relative z-10 w-full max-w-auto mb-8">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              📍 เลือกพื้นที่เพื่อดูข้อมูลสภาพอากาศ
            </h3>
            {/* <p className="text-gray-600 dark:text-gray-300">เลือกอำเภอเพื่อดูข้อมูลสภาพอากาศและสถานที่น่าสนใจ</p> */}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {buriramDistricts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedCity(district)}
                className={`px-6 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${selectedCity === district
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/50"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800 dark:hover:to-purple-800"
                  }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* เนื้อหาหลักในรูปแบบ flex แนวนอน */}
      <div className="relative z-10 w-full max-w-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* ส่วนซ้าย - สภาพอากาศ */}
        <div className="flex-1 w-full min-h-0 flex flex-col gap-8">
          {error && (
            <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 p-6 rounded-2xl text-red-700 dark:text-red-200 shadow-xl border border-red-200/50">
              <div className="flex items-center">
                <div className="text-3xl mr-4">⚠️</div>
                <p className="text-lg font-semibold">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-gray-300/50 dark:border-white/20">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">⛅</div>
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">กำลังโหลดข้อมูลสภาพอากาศ...</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">โปรดรอสักครู่</p>
            </div>
          )}

          {weather && !loading && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-300/50 dark:border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white drop-shadow-md">
                  📍 {weather.name}, {weather.sys.country}
                </h2>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-4 py-2 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    📅 {new Date().toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-6 shadow-inner">
                <div className="text-center sm:text-left mb-6 sm:mb-0">
                  <p className="text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-xl lg:text-2xl capitalize text-gray-700 dark:text-gray-300 font-semibold">
                    {weather.weather[0].description}
                  </p>
                </div>
                <div className="flex justify-center transform hover:scale-110 transition-transform duration-300">
                  {weatherIcons[weather.weather[0].main] || weatherIcons['Clear']}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-blue-500 mb-3">
                    <WiHumidity className="text-5xl" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">ความชื้น</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{weather.main.humidity}%</p>
                </div>

                <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-green-500 mb-3">
                    <WiStrongWind className="text-5xl" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">ความเร็วลม</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{weather.wind.speed} m/s</p>
                </div>

                <div className="bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/50 dark:to-orange-800/50 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-red-500 mb-3 text-4xl">🌡️</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">รู้สึกเหมือน</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(weather.main.feels_like)}°C</p>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/50 dark:to-pink-800/50 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-purple-500 mb-3 text-4xl">👁️</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">ทัศนวิสัย</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{weather.visibility / 1000} km</p>
                </div>
              </div>
            </div>
          )}

          {/* แผนที่ท่องเที่ยว - ปรับปรุงใหม่ */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-300/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                🗺️ แผนที่ท่องเที่ยว <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">บุรีรัมย์</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">สำรวจสถานที่ท่องเที่ยวที่น่าสนใจในบุรีรัมย์</p>
            </div>
            {isClient && <TouristMap />}
          </div>
        </div>

        {/* ส่วนขวา - คำแนะนำจากบอท */}
        <div className="flex-1 w-full min-h-0 sticky top-6 h-fit">
          <div className="flex-1 w-full min-h-0 sticky top-6 h-fit">
            <Bot weather={weather} timeOfDay={timeOfDay} selectedCity={selectedCity} />
          </div>
        </div>
      </div>
    </div>
  );
}



















{/* ส่วนแผนที่
      <div className="flex-1">
        <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6">
            แผนที่ท่องเที่ยว <span className="text-blue-500">บุรีรัมย์</span>
          </h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              title="Tourist Attractions in Buriram"
              src={`https://www.google.com/maps/embed/v1/search?key=${googleMapsApiKey}&q=สถานที่+ท่องเที่ยว+${selectedCity}&zoom=13`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div> */}


{/* <div className="mt-10 w-full max-w-6xl">
        <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6">
            สถานที่ท่องเที่ยวแนะนำ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSpots.map((spot, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md transform hover:scale-[1.02] transition-transform">
                <div className="h-48 bg-gray-300 overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // target.src = "/api/placeholder/400/320";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{spot.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">อำเภอ: {spot.district}</p>
                  <p className="text-gray-700 dark:text-gray-300">{spot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}