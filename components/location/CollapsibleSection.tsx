'use client'

// import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Description from '@/components/location/Description'
import DescriptionAI from '@/components/location/DescriptionAI'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from 'next/image'

// Types for the component props
interface CollapsibleSectionProps {
    title: string
    content?: string  // For regular description
    type: 'description' | 'ai-description'
    locationName?: string  // For AI description
    locationDescription?: string  // For AI description  
    locationDistrict?: string  // For AI description
    locationCategory?: string  // For AI description
    locationLat?: number  // For AI description
    locationLng?: number  // For AI description
    image?: string[] | string // Optional image array
}

const CollapsibleSection = ({
    title,
    content,
    type,
    locationName,
    locationDescription,
    locationDistrict,
    locationCategory,
    locationLat,
    locationLng,
    image,
}: CollapsibleSectionProps) => {
    // State to track if the section is expanded or collapsed
    // const [isExpanded, setIsExpanded] = useState(false)

    // Toggle expand/collapse state
    // const toggleExpand = () => {
    //     setIsExpanded(!isExpanded)
    // }

    // เตรียม array รูป
    const images = image
        ? (Array.isArray(image) ? image : [image])
        : [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    {title}
                </h2>
            </div>
            {/* แสดง Swiper ถ้ามีรูป */}
            {images.length > 0 && (
                <div className="mb-3 sm:mb-4">
                    {images.length > 1 ? (
                        <Swiper
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="h-40 sm:h-48 md:h-56 w-full rounded-xl"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative h-40 sm:h-48 md:h-56 w-full">
                                        <Image
                                            src={img || '/placeholder.jpg'}
                                            alt={`รูปที่ ${idx + 1}`}
                                            fill
                                            className="object-cover rounded-xl"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="relative h-40 sm:h-48 md:h-56 w-full">
                            <Image
                                src={images[0] || '/placeholder.jpg'}
                                alt="รูปเดียว"
                                fill
                                className="object-cover rounded-xl"
                            />
                        </div>
                    )}
                </div>
            )}
            <div>
                {type === 'description' && content && (
                    <Description description={content} />
                )}
                {type === 'ai-description' && locationName && locationDescription && (
                    <DescriptionAI
                        locationName={locationName}
                        locationDescription={locationDescription}
                        locationDistrict={locationDistrict || ''}
                        locationCategory={locationCategory || ''}
                        locationLat={locationLat}
                        locationLng={locationLng}
                    />
                )}
            </div>
        </div>
    )
}

export default CollapsibleSection