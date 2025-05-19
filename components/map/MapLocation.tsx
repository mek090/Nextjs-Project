'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, LayersControl, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect } from 'react';

// พิกัดจังหวัดบุรีรัมย์
const BURIRAM_COORDINATES: [number, number] = [14.9968, 103.1029];
const DEFAULT_ZOOM = 12;

// สร้างไอคอนที่สวยงาม
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ไอคอนสำหรับตำแหน่งที่เลือก
const selectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'selected-marker' // สามารถเพิ่ม CSS เพื่อเปลี่ยนสีได้
});

type LatLng = [number, number]
type LocationMarkerProps = {
    position: LatLng | null;
    setPosition: (position: LatLng) => void;
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
    const defaultLocation: LatLng = location ? [location.lat, location.lng] : BURIRAM_COORDINATES;
    const [position, setPosition] = useState<LatLng | null>(null);
    
    // เพิ่ม CSS สำหรับแผนที่
    useEffect(() => {
        // เพิ่ม CSS เพื่อปรับแต่งแผนที่
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-map-container {
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 3px solid #fff;
            }
            .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 10px;
                background-color: rgba(255, 255, 255, 0.95);
            }
            .custom-popup .leaflet-popup-tip {
                background-color: rgba(255, 255, 255, 0.95);
            }
            .map-title {
                background-color: #3498db;
                color: white;
                padding: 12px 20px;
                border-radius: 8px 8px 0 0;
                font-weight: 600;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .map-container-wrapper {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="map-container-wrapper">
            {/* <div className="map-title">เลือกตำแหน่งของคุณ</div> */}
            <input type='hidden' name='lat' value={position ? position[0] : ''} />
            <input type='hidden' name='lng' value={position ? position[1] : ''} />
            
            <MapContainer
                className='custom-map-container h-[60vh] w-full z-0 relative'
                center={defaultLocation}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                zoomControl={false}>

                {/* แสดง Marker ของบุรีรัมย์
                <Marker position={BURIRAM_COORDINATES} icon={customIcon}>
                    <Popup className="custom-popup">
                        <div className="text-center">
                            <strong>จังหวัดบุรีรัมย์</strong>
                            <p>ยินดีต้อนรับสู่บุรีรัมย์</p>
                        </div>
                    </Popup>
                </Marker> */}

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
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h2 className="font-semibold text-blue-800 mb-2">ตำแหน่งที่เลือก:</h2>
                    <p>ละติจูด: {position[0].toFixed(6)} | ลองจิจูด: {position[1].toFixed(6)}</p>
                </div>
            )}
        </div>
    )
}

export default MapLocation