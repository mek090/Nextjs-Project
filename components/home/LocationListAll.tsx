"use client"

import { useRef, useState, useEffect } from "react";
import LocationCard from "../card/LocationCard";
import { LocationCardProps } from "@/utils/types";
import LoadingCard from "../card/LoadingCard";

const LocationListAll = ({ Locations }: { Locations: LocationCardProps[] }) => {
    return (
        <section className="py-4 sm:py-6 md:py-8 lg:py-10">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {Locations.map((Location) => (
                        <div 
                            key={Location.id} 
                            className="transform transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-1.5 md:hover:-translate-y-2"
                        >
                            <LocationCard Location={Location} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationListAll;