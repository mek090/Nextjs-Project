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

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Location {
  id: string
  name: string
  description: string
  image: string[]
  lat: number
  lng: number
  districts: string
  category: string
}

export default function TouristMap() {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations')
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [])

  return (
    <MapContainer
      center={[14.9934, 103.1029]}
      zoom={10}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{location.name}</h3>
              <p className="text-sm mb-2">{location.description}</p>
              <p className="text-sm text-gray-600">อำเภอ: {location.districts}</p>
              <p className="text-sm text-gray-600">หมวดหมู่: {location.category}</p>
              <Link
                href={`/locations/${location.id}`}
                className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                ดูรายละเอียด
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}