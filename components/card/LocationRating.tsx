import { Star } from 'lucide-react';

interface LocationRatingProps {
  rating?: number;
  size?: number;
}

const LocationRating = ({ rating, size = 5 }: LocationRatingProps) => {
  if (!rating) return null;
  
  // Convert size to responsive classes
  const getSizeClass = (size: number) => {
    if (size <= 2) return 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3';
    if (size <= 3) return 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4';
    if (size <= 4) return 'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5';
    return 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6';
  };
  
  const sizeClass = getSizeClass(size);
  
  return (
    <div className="flex items-center">
      <Star 
        className={`${sizeClass} ${rating >= 1 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`${sizeClass} ${rating >= 2 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`${sizeClass} ${rating >= 3 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`${sizeClass} ${rating >= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
      <Star 
        className={`${sizeClass} ${rating >= 5 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
    </div>
  );
};

export default LocationRating;