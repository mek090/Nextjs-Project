"use client"

import { useState } from "react";
import LocationCard from "../card/LocationCard";
import { LocationCardProps } from "@/utils/types";

const FavLocation = ({ Locations }: { Locations: LocationCardProps[] }) => {
    const [visibleLocations, setVisibleLocations] = useState(6);
    
    const handleShowMore = () => {
        setVisibleLocations(prev => 
            prev + 6 > Locations.length ? Locations.length : prev + 6
        );
    };

    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2" >รายการโปรด</h2>
                    <div className="w-20 h-1 bg-blue-500 mx-auto mb-4"></div>
                    <p className=" max-w-2xl mx-auto">
                        รายการโปรดของคุณ
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Locations.slice(0, visibleLocations).map((Location) => (
                        <div 
                            key={Location.id} 
                            className="transform transition-all duration-300 hover:-translate-y-2"
                        >
                            <LocationCard Location={Location} />
                        </div>
                    ))}
                </div>

                {visibleLocations < Locations.length && (
                    <div className="text-center mt-10">
                        <button
                            onClick={handleShowMore}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700  rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto"
                        >
                            <span>แสดงเพิ่มเติม</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FavLocation;