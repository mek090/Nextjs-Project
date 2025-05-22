'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  photos?: Array<{
    photo_reference: string;
  }>;
  rating?: number;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchPlaces(category);
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">สถานที่ท่องเที่ยวในบุรีรัมย์</h1>
      
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
          <Link 
            href={`/places/${place.place_id}`} 
            key={place.place_id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
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
              {place.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{place.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
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