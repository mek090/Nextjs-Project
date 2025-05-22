"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ImageContainer = ({
    mainImage,
    name
}: {
    mainImage: string | string[],
    name: string
}) => {
    // Convert string to array if needed
    const images = typeof mainImage === 'string' ? [mainImage] : mainImage;
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <section className="h-[300px] md:h-[500px] relative mt-8">
            <Image
                src={images[currentIndex] || '/placeholder.jpg'}
                sizes="100vw"
                alt={`${name} - Image ${currentIndex + 1}`}
                fill
                className="object-cover rounded-md"
            />
            
            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </section>
    )
}

export default ImageContainer