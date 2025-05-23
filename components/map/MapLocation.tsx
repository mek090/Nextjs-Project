'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, LayersControl, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import { MapPin, Compass, Map } from 'lucide-react'

// พิกัดจังหวัดบุรีรัมย์
const BURIRAM_COORDINATES: [number, number] = [14.9968, 103.1029]
const DEFAULT_ZOOM = 12

// สร้างไอคอนที่สวยงาม
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// ไอคอนสำหรับตำแหน่งที่เลือก
const selectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'selected-marker' // สามารถเพิ่ม CSS เพื่อเปลี่ยนสีได้
})

type LatLng = [number, number]
type LocationMarkerProps = {
    position: LatLng | null
    setPosition: (position: LatLng) => void
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
    const map = useMapEvents({
        click(e) {
            const newLocation: LatLng = [e.latlng.lat, e.latlng.lng]
            setPosition(newLocation)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={selectedIcon}>
            <Popup className="custom-popup">
                <div className="text-center">
                    <strong>ตำแหน่งที่คุณเลือก</strong>
                    <p>ละติจูด: {position[0].toFixed(4)}</p>
                    <p>ลองจิจูด: {position[1].toFixed(4)}</p>
                </div>
            </Popup>
        </Marker>
    )
}

const MapLocation = ({ location }: { location?: { lat: number, lng: number } }) => {
    // ใช้พิกัดบุรีรัมย์เป็นค่าเริ่มต้น
    const defaultLocation: LatLng = location ? [location.lat, location.lng] : BURIRAM_COORDINATES
    const [position, setPosition] = useState<LatLng | null>(null)
    const [activeBaseMap, setActiveBaseMap] = useState<string>("OpenStreetMap")
    
    // เพิ่ม CSS สำหรับแผนที่
    useEffect(() => {
        // เพิ่ม CSS เพื่อปรับแต่งแผนที่
        const style = document.createElement('style')
        style.innerHTML = `
            .custom-map-container {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border: 2px solid #f0f0f0;
                transition: all 0.3s ease;
            }
            .custom-map-container:hover {
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }
            .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 12px;
                background-color: rgba(255, 255, 255, 0.95);
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }
            .custom-popup .leaflet-popup-tip {
                background-color: rgba(255, 255, 255, 0.95);
            }
            .custom-popup .leaflet-popup-content {
                margin: 12px 18px;
                line-height: 1.6;
            }
            .leaflet-control-layers-toggle {
                background-color: white;
                border-radius: 6px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .leaflet-touch .leaflet-control-layers-toggle {
                width: 36px;
                height: 36px;
            }
            .leaflet-control-zoom {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .leaflet-touch .leaflet-control-zoom-in, 
            .leaflet-touch .leaflet-control-zoom-out {
                font-size: 18px;
                width: 36px;
                height: 36px;
                line-height: 36px;
            }
            .selected-marker {
                filter: hue-rotate(210deg);
            }
            .map-type-selector {
                display: flex;
                justify-content: center;
                margin-bottom: 16px;
            }
            .map-type-selector button {
                padding: 8px 16px;
                border-radius: 6px;
                background-color: white;
                border: 1px solid #e2e8f0;
                margin: 0 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            .map-type-selector button:hover {
                background-color: #f8fafc;
            }
            .map-type-selector button.active {
                background-color: #3b82f6;
                color: white;
                border-color: #2563eb;
            }
            .map-coordinate-display {
                background: linear-gradient(to right, #e0f2fe, #dbeafe);
                border-radius: 8px;
                padding: 12px 16px;
                margin-top: 16px;
                border: 1px solid #bfdbfe;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .map-coordinate-display h3 {
                color: #1e40af;
                font-weight: 600;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .map-coordinate-display p {
                color: #334155;
                font-size: 15px;
            }
        `
        document.head.appendChild(style)
        
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    const handleMapTypeChange = (type: string) => {
        setActiveBaseMap(type)
        // ต้องการที่จะเปลี่ยน base layer ของ leaflet ด้วย (ไม่สามารถทำได้โดยตรงจากนี่)
        // ในอนาคตอาจใช้ useRef หรือ imperative handle ของ leaflet เพื่อควบคุม
    }

    return (
        <div>
            {/* <div className="flex items-center gap-3 mb-4">
                <Map className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                   แผนที่จังหวัดบุรีรัมย์
                </h2>
            </div> */}

            
            <input type='hidden' name='lat' value={position ? position[0] : ''} />
            <input type='hidden' name='lng' value={position ? position[1] : ''} />
            
            <MapContainer
                className='custom-map-container h-[60vh] w-full z-0 relative'
                center={defaultLocation}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                zoomControl={false}>

                {/* แสดง Marker ของสถานที่ */}
                {location && (
                    <Marker position={[location.lat, location.lng]} icon={selectedIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <strong>สถานที่</strong>
                                <p>ละติจูด: {location.lat.toFixed(4)}</p>
                                <p>ลองจิจูด: {location.lng.toFixed(4)}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* แสดงตำแหน่งที่ผู้ใช้เลือก */}
                <LocationMarker position={position} setPosition={setPosition} />

                {/* ปุ่ม zoom แยกออกมาไว้มุมขวาล่าง */}
                <ZoomControl position="bottomright" />

                {/* เลเยอร์แผนที่หลายรูปแบบ */}
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="แผนที่ภาพถ่ายดาวเทียม">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="แผนที่ขาวดำ">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="แผนที่กลางคืน">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
            </MapContainer>
            
            {position && (
                <div className="map-coordinate-display">
                    <h3><MapPin size={18} /> ตำแหน่งที่เลือก</h3>
                    <p>ละติจูด: {position[0].toFixed(6)} | ลองจิจูด: {position[1].toFixed(6)}</p>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
                <p>* คลิกที่แผนที่เพื่อเลือกตำแหน่ง หรือใช้ปุ่มควบคุมด้านขวาเพื่อปรับมุมมอง</p>
            </div>
        </div>
    )
}

export default MapLocation