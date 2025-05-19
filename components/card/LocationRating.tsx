import { Star } from 'lucide-react';

interface LocationRatingProps {
  rating?: number;
  size?: number;
}

const LocationRating = ({ rating, size = 5 }: LocationRatingProps) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center">
      <Star 
        className={`w-${size} h-${size} ${rating >= 1 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`w-${size} h-${size} ${rating >= 2 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`w-${size} h-${size} ${rating >= 3 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`w-${size} h-${size} ${rating >= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`w-${size} h-${size} ${rating >= 5 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
    </div>
  );
};

export default LocationRating;