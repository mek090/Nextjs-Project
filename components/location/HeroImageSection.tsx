"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function HeroImageSection({ images = [], alt }: { images: string[]; alt: string }) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="relative w-full h-full mb-4">
        <Image src={images[0] || "/placeholder.jpg"} alt={alt} fill className="object-cover rounded-lg" />
      </div>
    );
  }
  return (
    <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]} className="h-full w-full rounded-lg">
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative h-full w-full">
            <Image src={img || "/placeholder.jpg"} alt={`${alt} - รูปที่ ${idx + 1}`} fill className="object-cover rounded-lg" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}