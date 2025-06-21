"use client"

import { useRef, useState, useEffect } from "react";
import LocationCard from "../card/LocationCard";
import { LocationCardProps } from "@/utils/types";
import LoadingCard from "../card/LoadingCard";

const LocationList = ({ Locations }: { Locations: LocationCardProps[] }) => {
    return (
        <section className="py-6 sm:py-8 lg:py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {Locations.slice(0, 4).map((Location) => (
                        <div 
                            key={Location.id} 
                            className="transform transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
                        >
                            <LocationCard Location={Location} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationList;