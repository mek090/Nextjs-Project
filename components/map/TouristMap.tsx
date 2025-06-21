// 'use client'

// import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
// import { useState, useEffect } from 'react'
// import { MapPin } from 'lucide-react'

// // พิกัดจังหวัดบุรีรัมย์
// const BURIRAM_COORDINATES: [number, number] = [14.9968, 103.1029]
// const DEFAULT_ZOOM = 12
// const MAP_BOUNDS = L.latLngBounds(
//   L.latLng(14.3, 102.7), // ตะวันตกเฉียงใต้
//   L.latLng(15.7, 103.5)  // ตะวันออกเฉียงเหนือ
// )

// // สร้างไอคอน
// const customIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// })

// const TouristMap = () => {
//   const [position, setPosition] = useState<[number, number] | null>(null)

//   useEffect(() => {
//     const style = document.createElement('style')
//     style.innerHTML = `
//       .custom-map-container {
//         border-radius: 12px;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         border: 2px solid #f0f0f0;
//       }
//       .custom-popup .leaflet-popup-content-wrapper {
//         border-radius: 12px;
//         background-color: rgba(255, 255, 255, 0.95);
//       }
//     `
//     document.head.appendChild(style)

//     return () => {
//       document.head.removeChild(style)
//     }
//   }, [])

//   return (
//     <div>
//       <input type='hidden' name='lat' value={position ? position[0] : ''} />
//       <input type='hidden' name='lng' value={position ? position[1] : ''} />

//       <MapContainer
//         className='custom-map-container h-[60vh] w-full z-0 relative'
//         center={BURIRAM_COORDINATES}
//         zoom={DEFAULT_ZOOM}
//         scrollWheelZoom={true}
//         zoomControl={false}
//         maxBounds={MAP_BOUNDS}
//         maxBoundsViscosity={1.0}>

//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {position && (
//           <Marker position={position} icon={customIcon}>
//             <Popup className="custom-popup">
//               <div className="text-center">
//                 <strong>ตำแหน่งที่เลือก</strong>
//                 <p>ละติจูด: {position[0].toFixed(4)}</p>
//                 <p>ลองจิจูด: {position[1].toFixed(4)}</p>
//               </div>
//             </Popup>
//           </Marker>
//         )}

//         <ZoomControl position="bottomright" />
//       </MapContainer>

//       {position && (
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <h3 className="flex items-center gap-2 font-medium">
//             <MapPin size={18} /> ตำแหน่งที่เลือก
//           </h3>
//           <p>ละติจูด: {position[0].toFixed(6)}</p>
//           <p>ลองจิจูด: {position[1].toFixed(6)}</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default TouristMap

// components/map/TouristMap.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, LatLngBounds } from 'leaflet'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Camera, Tag, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// การตั้งค่าพิกัดและขอบเขตแผนที่
const BURIRAM_CENTER: [number, number] = [14.9934, 103.1029]
const DEFAULT_ZOOM = 10
const MAP_BOUNDS = new LatLngBounds(
  [14.2, 102.6], // ตะวันตกเฉียงใต้
  [15.8, 103.6]  // ตะวันออกเฉียงเหนือ
)

// สร้างไอคอนแบบกำหนดเอง
const createCustomIcon = (category: string) => {
  const colors: { [key: string]: string } = {
    'วัด': '#10B981', // เขียว
    'ปราสาท': '#EF4444', // แดง
    'พิพิธภัณฑ์': '#3B82F6', // ฟ้า
    'ธรรมชาติ': '#059669', // เขียวเข้ม
    'ตลาด': '#F59E0B', // เหลือง
    'default': '#6B7280' // เทา
  }
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colors[category] || colors.default}" width="32" height="32">
        <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

interface Location {
  id: string
  name: string
  description: string
  image: string[]
  lat: number
  lng: number
  districts: string
  category: string
  createdAt?: string
}

interface TouristMapProps {
  className?: string
  height?: string
}

export default function TouristMap({ className = "", height = "500px" }: TouristMapProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/locations')
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setError('ไม่สามารถโหลดข้อมูลสถานที่ได้')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // กรองสถานที่ตามหมวดหมู่
  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(location => location.category === selectedCategory)

  // รับหมวดหมู่ทั้งหมด
  const categories = ['all', ...Array.from(new Set(locations.map(location => location.category)))]

  // ตั้งค่า CSS สำหรับแผนที่
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .custom-map-container {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        background: white;
      }
      
      .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0;
        max-width: 300px;
      }
      
      .custom-popup .leaflet-popup-content {
        margin: 0;
        padding: 0;
      }
      
      .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }
      
      .leaflet-control-zoom a {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        color: #374151 !important;
        font-weight: bold !important;
      }
      
      .leaflet-control-zoom a:hover {
        background: white !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  if (loading) {
    return (
      <Card className={`${className} shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600">กำลังโหลดแผนที่...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${className} shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                ลองใหม่
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      

      {/* สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สถานที่ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">หมวดหมู่</p>
                <p className="text-2xl font-bold text-green-600">{categories.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">กำลังแสดง</p>
                <p className="text-2xl font-bold text-purple-600">{filteredLocations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ตัวกรองหมวดหมู่ */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Tag className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">กรองตามหมวดหมู่</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 transition-all duration-200 ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'ทั้งหมด' : category} 
              <span className="ml-1 text-xs">
                ({category === 'all' ? locations.length : locations.filter(l => l.category === category).length})
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* แผนที่ */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <MapContainer
            className="custom-map-container"
            center={BURIRAM_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height, width: "100%" }}
            scrollWheelZoom={true}
            zoomControl={false}
            maxBounds={MAP_BOUNDS}
            maxBoundsViscosity={0.8}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(location.category)}
              >
                <Popup className="custom-popup">
                  <div className="w-full max-w-sm">
                    {/* รูปภาพ */}
                    {location.image.length > 0 && (
                      <div className="relative h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={location.image[0]}
                          alt={location.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                            <Camera className="h-3 w-3 mr-1" />
                            {location.image.length}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* เนื้อหา */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
                        {location.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {location.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>อำเภอ{location.districts}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Tag className="h-4 w-4 mr-2 text-gray-400" />
                          <Badge variant="secondary" className="text-xs">
                            {location.category}
                          </Badge>
                        </div>
                        
                        {location.createdAt && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>เพิ่มเมื่อ {new Date(location.createdAt).toLocaleDateString('th-TH')}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link href={`/locations/${location.id}`}>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          ดูรายละเอียด
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <ZoomControl position="bottomright" />
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  )
}