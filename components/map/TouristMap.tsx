"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
  image: string[];
  districts: string;
  price: string;
  openTime: string | null;
  closeTime: string | null;
  rating: number | null;
}

export default function TouristMap() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('ไม่สามารถโหลดข้อมูลสถานที่ได้');
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
  };

  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[14.9932, 103.1022]} // Buriram coordinates
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                {location.image && location.image.length > 0 && !imageErrors.has(location.image[0]) && (
                  <div className="relative w-full h-32 mb-2">
                    <img
                      src={location.image[0]}
                      alt={location.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={() => handleImageError(location.image[0])}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">ประเภท:</span> {location.category}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">อำเภอ:</span> {location.districts}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">ค่าเข้าชม:</span> {location.price}
                  </p>
                  {location.openTime && location.closeTime && (
                    <p className="text-sm">
                      <span className="font-semibold">เวลาเปิด-ปิด:</span> {location.openTime} - {location.closeTime}
                    </p>
                  )}
                  {location.rating && (
                    <p className="text-sm">
                      <span className="font-semibold">คะแนน:</span> {location.rating.toFixed(1)}/5
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 