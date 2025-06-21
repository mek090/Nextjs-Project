'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from './ImageModal';

interface ImageGridProps {
    images: string[];
    locationName: string;
}

export default function ImageGrid({ images, locationName }: ImageGridProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square cursor-pointer group">
                        <Image
                            src={img}
                            alt={`${locationName} - Image ${index + 2}`}
                            fill
                            className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setSelectedImage(img)}
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    alt={`${locationName} - Full size image`}
                />
            )}
        </>
    );
} 