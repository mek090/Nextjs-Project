'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Check, Plus } from 'lucide-react';


interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  photos?: Array<{
    photo_reference: string;
  }>;
  isSaved?: boolean;
  // rating?: number;
}

// Modern Save Button Component
function SavePlaceButton({ place, savingPlaceId, savePlaceToDatabase }: {
  place: Place;
  savingPlaceId: string | null;
  savePlaceToDatabase: (place: Place) => void;
}) {
  return (
    <button
      onClick={() => savePlaceToDatabase(place)}
      disabled={place.isSaved || savingPlaceId === place.place_id}
      className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm
        transition-all duration-300 ease-out transform group
        shadow-lg hover:shadow-xl active:scale-95
        ${place.isSaved
          ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white cursor-not-allowed'
          : savingPlaceId === place.place_id
            ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105'
        }
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {place.isSaved ? (
          <>
            <Check className="w-5 h-5" />
            บันทึกแล้ว
          </>
        ) : savingPlaceId === place.place_id ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            กำลังอัพโหลด...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
            เพิ่มสถานที่
          </>
        )}
      </span>
      
      {/* Animated background effect */}
      {!place.isSaved && savingPlaceId !== place.place_id && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      )}
      
      {/* Sparkle effect for saving state */}
      {savingPlaceId === place.place_id && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-70 animate-ping"></div>
          <div className="absolute top-2 right-3 w-2 h-2 bg-white rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-2 left-4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.7s' }}></div>
        </div>
      )}
    </button>
  );
}

export default function PlacesPage() {
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null);

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
      const placesWithSavedStatus = await Promise.all(
        (data.results || []).map(async (place: Place) => {
          const savedResponse = await fetch(`/api/places/saved?place_id=${place.place_id}`);
          const savedData = await savedResponse.json();
          return { ...place, isSaved: savedData.isSaved };
        })
      );
      setPlaces(placesWithSavedStatus);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    setLoading(false);
  };

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      const placesWithSavedStatus = await Promise.all(
        (data.results || []).map(async (place: Place) => {
          const savedResponse = await fetch(`/api/places/saved?place_id=${place.place_id}`);
          const savedData = await savedResponse.json();
          return { ...place, isSaved: savedData.isSaved };
        })
      );
      setSearchResults(placesWithSavedStatus);
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error('เกิดข้อผิดพลาดในการค้นหาสถานที่');
    }
    setIsSearching(false);
  };

  // ใช้ debounce เพื่อลดการเรียก API บ่อยเกินไป
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const savePlaceToDatabase = async (place: Place) => {
    try {
      // ดึงข้อมูลเพิ่มเติมจาก Place Details API
      setSavingPlaceId(place.place_id);

      const detailsResponse = await fetch(`/api/places/details?place_id=${place.place_id}`);
      const detailsData = await detailsResponse.json();
      const placeDetails = detailsData.result;

      if (!placeDetails) {
        throw new Error('ไม่สามารถดึงข้อมูลสถานที่ได้');
      }

      console.log('Place Details:', {
        name: placeDetails.name,
        opening_hours: placeDetails.opening_hours,
        weekday_text: placeDetails.opening_hours?.weekday_text,
      });

      // ส่งข้อมูลไปให้ Gemini วิเคราะห์
      const geminiResponse = await fetch('/api/gemini/analyze-place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: place.name,
          address: place.formatted_address,
          business_status: placeDetails.business_status,
          opening_hours: placeDetails.opening_hours,
          price_level: placeDetails.price_level,
          photos: placeDetails.photos?.slice(0, 10) || [],
        }),
      });

      if (!geminiResponse.ok) {
        throw new Error('ไม่สามารถวิเคราะห์ข้อมูลสถานที่ได้');
      }

      const analyzedData = await geminiResponse.json();

      // แปลงเวลาทำการเป็นรูปแบบ 24 ชั่วโมง
      let openTime = null;
      let closeTime = null;
      if (placeDetails.opening_hours?.weekday_text?.[0]) {
        const timeText = placeDetails.opening_hours.weekday_text[0];
        console.log('Original time text:', timeText);
        const timeMatch = timeText.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*–\s*(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (timeMatch) {
          // แปลงเวลาเปิดเป็น 24 ชั่วโมง
          let openHours = parseInt(timeMatch[1]);
          const openMinutes = timeMatch[2];
          const openPeriod = timeMatch[3];

          if (openPeriod === 'PM' && openHours !== 12) openHours += 12;
          if (openPeriod === 'AM' && openHours === 12) openHours = 0;
          openTime = `${openHours.toString().padStart(2, '0')}:${openMinutes}`;

          // แปลงเวลาปิดเป็น 24 ชั่วโมง
          let closeHours = parseInt(timeMatch[4]);
          const closeMinutes = timeMatch[5];
          const closePeriod = timeMatch[6];

          if (closePeriod === 'PM' && closeHours !== 12) closeHours += 12;
          if (closePeriod === 'AM' && closeHours === 12) closeHours = 0;
          closeTime = `${closeHours.toString().padStart(2, '0')}:${closeMinutes}`;

          console.log('Converted times:', { openTime, closeTime });
        } else {
          console.log('No time match found in:', timeText);
          // ถ้าไม่พบรูปแบบเวลาที่ตรงกัน ให้ใช้ค่าเริ่มต้นสำหรับวัด
          openTime = '08:00';
          closeTime = '17:00';
          console.log('Using default times for temple:', { openTime, closeTime });
        }
      } else {
        console.log('No opening hours data');
        // ถ้าไม่มีข้อมูลเวลาทำการ ให้ใช้ค่าเริ่มต้นสำหรับวัด
        openTime = '08:00';
        closeTime = '17:00';
        console.log('Using default times for temple:', { openTime, closeTime });
      }

      // ใช้ข้อมูลที่ Gemini วิเคราะห์แล้ว
      const description = analyzedData.description;
      const price = analyzedData.price;
      const selectedCategory = analyzedData.category || category;
      const district = analyzedData.district;
      const thaiName = analyzedData.thaiName || place.name; // ใช้ชื่อภาษาไทยที่ Gemini แนะนำ หรือใช้ชื่อเดิมถ้าไม่มี

      // รวบรวมรูปภาพที่ Gemini คัดเลือกแล้ว
      const images = analyzedData.selectedPhotos.map((photo: { photo_reference: any }) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );

      console.log('Images to upload:', images.length);

      const requestBody = {
        name: thaiName,
        description,
        category: selectedCategory,
        districts: district,
        lat: placeDetails.geometry?.location?.lat || 0,
        lng: placeDetails.geometry?.location?.lng || 0,
        price,
        image: images,
        openTime,
        closeTime,
        googlePlaceId: place.place_id,
      };

      console.log('Request body:', requestBody);

      const response = await fetch('/api/places/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save place');
      }

      const responseData = await response.json();
      console.log('Save response:', responseData);

      // อัพเดทสถานะการบันทึก
      const updatedPlaces = places.map(p =>
        p.place_id === place.place_id ? { ...p, isSaved: true } : p
      );
      setPlaces(updatedPlaces);

      const updatedSearchResults = searchResults.map(p =>
        p.place_id === place.place_id ? { ...p, isSaved: true } : p
      );
      setSearchResults(updatedSearchResults);

      toast.success(`บันทึกสถานที่เรียบร้อยแล้ว${responseData.message ? ` (${responseData.message})` : ''}`);
    } catch (error) {
      console.error('Error saving place:', error);
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกสถานที่');
    } finally {
      setSavingPlaceId(null); // ✅ รีเซ็ตหลังเสร็จ
    }
  };

  useEffect(() => {
    fetchPlaces(category);
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ข้อมูลสถานที่ท่องเที่ยวในบุรีรัมย์</h1>
      <h3 className="text-3xl font-bold mb-8 text-center">With Google Places</h3>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาสถานที่ท่องเที่ยว..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full ${category === cat.id
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
        {(searchQuery ? searchResults : places).map((place) => (
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
              <div className="flex justify-between items-center">
                <Link
                  href={`/dashboard/places/${place.place_id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ดูรายละเอียด
                </Link>
                
                <SavePlaceButton 
                  place={place}
                  savingPlaceId={savingPlaceId}
                  savePlaceToDatabase={savePlaceToDatabase}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && !isSearching && (searchQuery ? searchResults : places).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'ไม่พบสถานที่ที่ค้นหา' : 'ไม่พบสถานที่ท่องเที่ยวในหมวดหมู่นี้'}
        </div>
      )}
    </div>
  );
}