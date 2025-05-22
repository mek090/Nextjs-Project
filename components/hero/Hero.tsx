'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { LocationCardProps } from "@/utils/types"
import OtherInfo from "./OtherInfo"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Hero = ({ locations }: { locations: LocationCardProps[] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!locations || locations.length === 0) {
        return (
            <div className="relative w-full h-[400px] bg-gray-200 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }

    // เลือกสถานที่ที่มีรูปภาพสวยๆ มาแสดง
    const featuredLocations = locations
        .filter(location => location.image && location.image.length > 0)
        .slice(0, 5);

    return (
        <div className="relative h-[600px] w-full">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="h-full w-full"
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
            >
                {featuredLocations.map((location, index) => (
                    <SwiperSlide key={location.id}>
                        <div className="relative h-full w-full">
                            <Image
                                src={Array.isArray(location.image) ? location.image[0] : location.image}
                                alt={location.name}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-x-0 bottom-0 flex items-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="w-full max-w-2xl">
                                    <OtherInfo location={location} />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
        </div>
    )
}

export default Hero