"use client";
import HeroImageSection from "@/components/location/HeroImageSection";

export default function HeroImageSectionWrapper({ images, alt }: { images: string[]; alt: string }) {
  return <HeroImageSection images={images} alt={alt} />;
}