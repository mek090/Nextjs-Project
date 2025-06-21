"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  Ticket,
  Clock3,
  Utensils,
  Car,
  Phone,
  Globe,
  ThumbsUp,
  Camera,
  Map,
  Navigation,
  Sun,
  Cloud,
  Umbrella,
  RefreshCw
} from "lucide-react";
import { getWeatherData } from '@/lib/fetchWeather';
import { WeatherResponse } from '@/utils/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface DescriptionAIProps {
  locationName: string;
  locationDescription: string;
  locationDistrict: string;
  locationCategory?: string;
  locationLat?: number;
  locationLng?: number;
}

interface NearbyLocation {
  id: string;
  name: string;
  distance: number;
  category: string;
  image: string[];
  price: string;
  districts: string;
  lat: number;
  lng: number;
}


const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;


// สร้างไอคอนที่สวยงาม
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function DescriptionAI({
  locationName,
  locationDescription,
  locationDistrict,
  locationCategory,
  locationLat,
  locationLng,
}: DescriptionAIProps) {
  const [aiDescription, setAiDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [selectedLocation, setSelectedLocation] = useState<NearbyLocation | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const generateDescription = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ดึงข้อมูลสภาพอากาศ
        try {
          const weatherResponse = await getWeatherData(locationDistrict);
          setWeatherData(weatherResponse);
        } catch (weatherError) {
          console.error("Error fetching weather data:", weatherError);
          setWeatherData(null);
        }

        // ดึงข้อมูลสถานที่ใกล้เคียง
        if (locationLat && locationLng) {
          try {
            const response = await fetch(
              `/api/nearby?lat=${locationLat}&lng=${locationLng}&radius=10&limit=5`
            );
            if (response.ok) {
              const data = await response.json();
              // กรองสถานที่ปัจจุบันออกจากรายการ
              const filteredLocations = data.filter((loc: NearbyLocation) =>
                loc.lat !== locationLat || loc.lng !== locationLng
              );
              setNearbyLocations(filteredLocations);
            }
          } catch (error) {
            console.error("Error fetching nearby locations:", error);
            setNearbyLocations([]);
          }
        }

        const response = await fetch('/api/gemini/analyze-place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationName,
            locationDescription,
            locationDistrict,
            locationCategory,
            locationLat,
            locationLng
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.description;

        if (!generatedText) {
          throw new Error("ไม่พบเนื้อหาในการตอบกลับ");
        }

        setAiDescription(generatedText);
      } catch (error) {
        console.error("Error generating description:", error);
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
        setAiDescription("");
      } finally {
        setIsLoading(false);
      }
    };

    generateDescription();
  }, [locationName, locationDescription, locationDistrict, locationCategory, locationLat, locationLng]);

  // สร้างไอคอนตามสภาพอากาศ
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "แดดร้อน": return <Sun className="h-5 w-5 text-yellow-500" />;
      case "มีเมฆมาก": return <Cloud className="h-5 w-5 text-gray-400" />;
      case "ฝนตกเล็กน้อย": return <Umbrella className="h-5 w-5 text-blue-400" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const renderTabs = () => {
    return (
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "description" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("description")}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>รายละเอียด</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "nearby" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("nearby")}
        >
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>สถานที่ใกล้เคียง</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "weather" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("weather")}
        >
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>สภาพอากาศ</span>
          </div>
        </button>
      </div>
    );
  };

  const renderNearbyLocations = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-bold">สถานที่ใกล้เคียงที่น่าสนใจ</h3>
        </div>

        {nearbyLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyLocations.map((location) => (
              <div key={location.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="relative h-32">
                  <img
                    src={location.image[0]}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                      {location.name}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full ml-2 flex-shrink-0">
                      {location.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {location.districts}
                    </span>
                    {location.price && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          💰 {location.price}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        🚗 {location.distance.toFixed(1)} กม.
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/locations/${location.id}`}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                      >
                        ดูรายละเอียด
                      </a>
                      <button
                        onClick={() => setSelectedLocation(location)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                      >
                        📍 แผนที่
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 italic">
            ไม่พบข้อมูลสถานที่ใกล้เคียง
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Map className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-bold">แผนที่</h3>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64">
            {selectedLocation ? (
              <MapContainer
                center={[selectedLocation.lat, selectedLocation.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    {selectedLocation.name}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <Map className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    ดูแผนที่การเดินทางไปยัง {locationName} จากตำแหน่งของคุณ
                  </p>
                  <button
                    onClick={() => setSelectedLocation({
                      id: 'current',
                      name: locationName,
                      distance: 0,
                      category: locationCategory || '',
                      image: [],
                      price: '',
                      districts: locationDistrict,
                      lat: locationLat || 0,
                      lng: locationLng || 0
                    })}
                    className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition inline-block"
                  >
                    นำทางด้วยแผนที่
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWeather = () => {
    console.log('weatherData', weatherData)
    console.log('Location name', locationName)

    return weatherData ? (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-bold">สภาพอากาศ ณ {locationName}</h3>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold mb-1">{Math.round(weatherData.main.temp)}°C</h4>
              <p className="text-gray-600 dark:text-gray-300">{weatherData.weather[0].description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">อัพเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}</p>
            </div>
            <div className="text-right">
              {getWeatherIcon(weatherData.weather[0].main)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
            <p className="font-medium mb-2">รู้สึกเหมือน</p>
            <div className="flex justify-center mb-1">
              <Sun className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-lg font-bold">{Math.round(weatherData.main.feels_like)}°C</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
            <p className="font-medium mb-2">ทัศนวิสัย</p>
            <div className="flex justify-center mb-1">
              <Cloud className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-lg font-bold">{Math.round(weatherData.visibility / 1000)} km</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
            <p className="font-medium mb-2">ความชื้น</p>
            <div className="flex justify-center mb-1">
              <Umbrella className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-lg font-bold">{weatherData.main.humidity}%</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 italic text-right flex items-center justify-end gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>อัพเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</span>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-bold flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>คำแนะนำสำหรับการเตรียมตัว</span>
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {weatherData.weather[0].main === "Clear" ?
              "สภาพอากาศแจ่มใส แนะนำให้พกร่ม หมวก และครีมกันแดด ดื่มน้ำให้เพียงพอ" :
              weatherData.weather[0].main === "Rain" ?
                "มีฝนตก ควรพกร่มหรือเสื้อกันฝนเผื่อไว้ ระวังทางลื่น" :
                "เตรียมเสื้อผ้าให้เหมาะสมกับอากาศ และพกน้ำดื่มให้เพียงพอ"}
          </p>
        </div>
      </div>
    ) : (
      <div className="text-gray-500 dark:text-gray-400 italic">
        ไม่พบข้อมูลสภาพอากาศ
      </div>
    );
  };

  const getDescriptionSections = () => {
    if (!aiDescription) return [];
    // แยกหัวข้อ (## )
    const sections = aiDescription.split('## ').filter(section => section.trim());
    return sections.map((section) => {
      const [title, ...content] = section.split('\n');
      return { title: title.trim(), content: content.join('\n').trim() };
    });
  };

  const renderDescriptionCards = () => {
    if (!aiDescription) return null;

    // --- ใช้ sections array ---
    const sections = getDescriptionSections();
    if (sections.length === 0) return null;

    // ถ้ายังไม่เลือกหัวข้อ ให้เลือกหัวข้อแรกเป็น default
    const currentSection = activeSection || sections[0].title;
    const sectionObj = sections.find(s => s.title === currentSection);

    // --- ปุ่มเลือกหัวข้อย่อย ---
    return (
      <>
        <div className="flex flex-wrap gap-2 mb-4">
          {sections.map((section, idx) => (
            <button
              key={section.title}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${currentSection === section.title ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-800'}`}
              onClick={() => setActiveSection(section.title)}
            >
              {section.title}
            </button>
          ))}
        </div>
        {sectionObj && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              {/* ไอคอนหัวข้อ */}
              {(() => {
                const title = sectionObj.title;
                if (title.includes('ประวัติ')) return <Clock className="h-5 w-5 text-amber-500" />;
                if (title.includes('จุดเด่น')) return <Camera className="h-5 w-5 text-blue-500" />;
                if (title.includes('กิจกรรม')) return <Ticket className="h-5 w-5 text-green-500" />;
                if (title.includes('ช่วงเวลา')) return <Calendar className="h-5 w-5 text-purple-500" />;
                if (title.includes('ข้อแนะนำ')) return <AlertCircle className="h-5 w-5 text-red-500" />;
                if (title.includes('อาหาร')) return <Utensils className="h-5 w-5 text-orange-500" />;
                if (title.includes('การเดินทาง')) return <Car className="h-5 w-5 text-indigo-500" />;
                if (title.includes('ข้อมูลติดต่อ')) return <Phone className="h-5 w-5 text-teal-500" />;
                return <Sparkles className="h-5 w-5 text-yellow-500" />;
              })()}
              <h3 className="font-bold text-gray-800 dark:text-white">{sectionObj.title}</h3>
            </div>
            <div className="p-4 prose dark:prose-invert max-w-none dark:text-white">
              <ReactMarkdown>{sectionObj.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderContent = () => {
    if (activeTab === "description") {
      return (
        <div className="space-y-4">
          {renderDescriptionCards()}
        </div>
      );
    } else if (activeTab === "nearby") {
      return renderNearbyLocations();
    } else if (activeTab === "weather") {
      return renderWeather();
    }
  };

  const renderLocationHeader = () => {
    console.log('กำลังดึงข้อมูลอากาศสำหรับ: ', locationDistrict);
    return (
      <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {locationName}
          </h2>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            <span className="text-xs sm:text-sm">อำเภอ{locationDistrict}, บุรีรัมย์</span>
            
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {locationCategory}
              </span>
              
              {/* t <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>แนะนำ</span>
            </span> */}
            </div>

        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            แนะนำสถานที่ท่องเที่ยว
          </h2>
        </div>

        {/* --- แสดง header และ tabs ทันที --- */}
        {renderLocationHeader()}
        {renderTabs()}

        {/* --- loading เฉพาะ tab รายละเอียด --- */}
        {activeTab === 'description' && isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-3 sm:space-y-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-white font-medium text-center text-sm sm:text-base">
              กำลังรวบรวมข้อมูลการท่องเที่ยว...
              <br />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-white">โปรดรอสักครู่</span>
            </p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <p className="text-red-700 dark:text-red-300 font-medium text-sm sm:text-base">ไม่สามารถรวบรวมข้อมูลได้</p>
            </div>
            <p className="mt-2 text-red-600 dark:text-red-300 text-xs sm:text-sm">{error}</p>
            <button
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 rounded-lg text-red-700 dark:text-red-300 transition font-medium text-xs sm:text-sm"
              onClick={() => window.location.reload()}
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : (
          <>{renderContent()}</>
        )}

        {!isLoading && !error && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 italic text-right">
            ข้อมูลจาก Gemini AI • อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
          </div>
        )}
      </div>
    </div>
  );
}