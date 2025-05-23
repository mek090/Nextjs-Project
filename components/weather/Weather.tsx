"use client";

import { useEffect, useState } from "react";
import { getWeatherData } from '../../lib/fetchWeather'
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiHumidity, WiStrongWind } from "react-icons/wi";
import Bot from "../GeminiBot/Bot";
import { WeatherIcons, WeatherResponse, SysData, WindData, MainWeatherData, WeatherCondition } from "@/utils/types";
import LocationContainer from "../home/LocationContainer";
import TouristMap from "../map/TouristMap";

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
      className="min-h-screen bg-cover bg-center bg-no-repeat text-gray-900 dark:text-white flex flex-col items-center py-3.5 px-4"
      style={{
        backgroundImage: timeOfDay === "กลางวัน"
          ? "url('/images/buriram-bg-day.jpg')"
          : "url('/images/buriram-bg-night.jpg')",
        backgroundAttachment: "fixed"
      }}
    >


      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl mb-6 max-w-6xl w-full">
        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg text-center">
          <span className="text-blue-600">📍</span> มนต์เสน่ห์เมืองปราสาท | BURIRAM HERITAGE
        </h1>
        <p className="text-center text-lg">เที่ยว เช็ค สภาพอากาศ กิน นอน พักผ่อน ที่บุรีรัมย์</p>
      </div>





      {/* เลือกอำเภอ */}
      <div className="w-full max-w-6xl mb-6">
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-lg">
          <div className="flex flex-wrap gap-3 justify-center">
            {buriramDistricts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedCity(district)}
                className={`px-4 py-2 rounded-full text-lg transition-all ${selectedCity === district
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-800"
                  }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* เนื้อหาหลักในรูปแบบ flex แนวนอน */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 items-start">
        {/* ส่วนซ้าย - สภาพอากาศ */}
        <div className="flex-1 w-full min-h-0 flex flex-col gap-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-xl text-red-700 dark:text-red-200">
              <p className="text-center">{error}</p>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-xl text-center backdrop-blur-lg border border-gray-300 dark:border-white/30">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-xl mt-4">กำลังโหลดข้อมูลสภาพอากาศ...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="bg-white dark:bg-gray-800 bg-opacity-95 p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-300 dark:border-gray-700 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold drop-shadow-md">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-sm bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 mb-4">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <p className="text-6xl font-bold text-gray-900 dark:text-white">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-xl capitalize text-gray-700 dark:text-gray-300">{weather.weather[0].description}</p>
                </div>
                <div className="flex justify-center">
                  {weatherIcons[weather.weather[0].main] || weatherIcons['Clear']}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                  <div className="mr-3 text-blue-500">
                    <WiHumidity className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ความชื้น</p>
                    <p className="text-xl font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                  <div className="mr-3 text-green-500">
                    <WiStrongWind className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ความเร็วลม</p>
                    <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                  <div className="mr-3 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">อุณหภูมิสูงสุด</p>
                    <p className="text-xl font-semibold">{Math.round(weather.main.temp_max)}°C</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                  <div className="mr-3 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">อุณหภูมิต่ำสุด</p>
                    <p className="text-xl font-semibold">{Math.round(weather.main.temp_min)}°C</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-6">
              แผนที่ท่องเที่ยว <span className="text-blue-500">บุรีรัมย์</span>
            </h2>
            <TouristMap />
          </div>

        </div>

        {/* ส่วนขวา - คำแนะนำจากบอท */}
        <div className="flex-1 w-full min-h-0 sticky top-6 h-fit">
          <Bot weather={weather} timeOfDay={timeOfDay} selectedCity={selectedCity} />
        </div>


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
      </div>

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


    </div>
  );
}