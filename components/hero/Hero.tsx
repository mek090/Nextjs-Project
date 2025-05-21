'use client'

import { LocationCardProps } from "@/utils/types"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import OtherInfo from "./OtherInfo";

const Hero = ({ locations }: { locations: LocationCardProps[] }) => {
    if (!locations || locations.length === 0) {
        return (
            <div className="relative w-full h-[400px] bg-gray-200 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400">Loading...</span>
                </div>
            </div>
        );
    }
 

    return (
        <div className="relative w-full h-[700px]">
            <Swiper
                navigation={true}
                modules={[Navigation, Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                loop={true}
                className="w-full h-full group"
                speed={800}
            >
                {locations.slice(0, 4).map((location) => (
                    <SwiperSlide key={location.id}>
                        <div className="relative w-full h-full">
                            <img
                                src={location.image}
                                alt={location.name}
                                className="w-full h-full object-cover brightness-75 rounded-lg group-hover:brightness-50 transition-all duration-300"
                            />
                            <div className="absolute inset-x-0 bottom-0 flex items-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="w-full max-w-2xl opacity-0 transition-opacity duration-800 swiper-no-duplicate-effect">
                                    <OtherInfo location={location} />
                                </div>
                            </div>
                           
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom styles for Swiper */}
            <style jsx global>{`
                .swiper-slide-active .swiper-no-duplicate-effect {
                    opacity: 1 !important;
                }
                .swiper-slide:not(.swiper-slide-active) .swiper-no-duplicate-effect {
                    opacity: 0 !important;
                    transition: opacity 0.3s ease-out;
                }
                /* ป้องกันการแสดงผลซ้ำซ้อนในขณะที่ slide กำลังเปลี่ยน */
                .swiper-slide-duplicate-active .swiper-no-duplicate-effect {
                    opacity: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default Hero;