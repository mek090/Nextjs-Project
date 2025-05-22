'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  photos?: Array<{
    photo_reference: string;
  }>;
  // rating?: number;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const categories = [
    { id: '', label: 'ทั้งหมด' },
    { id: 'Culture', label: 'วัฒนธรรม' },
    { id: 'Nature', label: 'ธรรมชาติ' },
    { id: 'Spots', label: 'สถานที่ท่องเที่ยว' },
    { id: 'Markets', label: 'ตลาด' },
    { id: 'Temples', label: 'วัด' },
  ];

  const fetchPlaces = async (selectedCategory: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/places?category=${selectedCategory}`);
      const data = await response.json();
      setPlaces(data.results || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    setLoading(false);
  };

  const savePlaceToDatabase = async (place: Place) => {
    try {
      // ดึงข้อมูลเพิ่มเติมจาก Place Details API
      const detailsResponse = await fetch(`/api/places/details?place_id=${place.place_id}`);
      const detailsData = await detailsResponse.json();
      const placeDetails = detailsData.result;

      if (!placeDetails) {
        throw new Error('ไม่สามารถดึงข้อมูลสถานที่ได้');
      }

      // ส่งข้อมูลไปให้ Gemini วิเคราะห์
      const geminiResponse = await fetch('/api/gemini/analyze-place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: place.name,
          address: place.formatted_address,
          rating: placeDetails.rating,
          user_ratings_total: placeDetails.user_ratings_total,
          business_status: placeDetails.business_status,
          opening_hours: placeDetails.opening_hours,
          price_level: placeDetails.price_level,
          reviews: placeDetails.reviews,
          photos: placeDetails.photos,
        }),
      });

      if (!geminiResponse.ok) {
        throw new Error('ไม่สามารถวิเคราะห์ข้อมูลสถานที่ได้');
      }

      const analyzedData = await geminiResponse.json();

      // แยกที่อยู่เป็นส่วนๆ
      const addressParts = place.formatted_address.split(',');
      const district = addressParts[0].trim();

      // แยกเวลาทำการ
      let openTime = null;
      let closeTime = null;
      if (placeDetails.opening_hours?.weekday_text?.[0]) {
        const timeParts = placeDetails.opening_hours.weekday_text[0].split(' ');
        if (timeParts.length >= 3) {
          openTime = timeParts.slice(1, -1).join(' ');
          closeTime = timeParts[timeParts.length - 1];
        }
      }

      // ใช้ข้อมูลที่ Gemini วิเคราะห์แล้ว
      const description = analyzedData.description;
      const price = analyzedData.price;
      const selectedCategory = analyzedData.category || category;

      // รวบรวมรูปภาพที่ Gemini คัดเลือกแล้ว
      const images = analyzedData.selectedPhotos.map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );

      const response = await fetch('/api/places/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: place.name,
          description,
          category: selectedCategory,
          districts: district,
          lat: placeDetails.geometry?.location?.lat || 0,
          lng: placeDetails.geometry?.location?.lng || 0,
          price,
          image: images,
          openTime,
          closeTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save place');
      }

      toast.success('บันทึกสถานที่เรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error saving place:', error);
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกสถานที่');
    }
  };

  useEffect(() => {
    fetchPlaces(category);
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ข้อมูลสถานที่ท่องเที่ยวในบุรีรัมย์</h1>
      <h3 className="text-3xl font-bold mb-8 text-center">With Google Places</h3>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full ${
              category === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div key={place.place_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {place.photos && place.photos[0] && (
              <div className="relative h-48">
                <Image
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                  alt={place.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
              <p className="text-gray-600 mb-2">{place.formatted_address}</p>
              {/* {place.rating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{place.rating.toFixed(1)}</span>
                </div>
              )} */}
              <div className="flex justify-between items-center">
                <Link 
                  href={`/dashboard/places/${place.place_id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ดูรายละเอียด
                </Link>
                <button
                  onClick={() => savePlaceToDatabase(place)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  เพิ่มสถานที่
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && places.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          ไม่พบสถานที่ท่องเที่ยวในหมวดหมู่นี้
        </div>
      )}
    </div>
  );
} 