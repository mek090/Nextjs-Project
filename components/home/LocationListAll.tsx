"use client"

import { useRef, useState, useEffect } from "react";
import LocationCard from "../card/LocationCard";
import { LocationCardProps } from "@/utils/types";
import LoadingCard from "../card/LoadingCard";
import { useAuth } from "@clerk/nextjs";
import { checkFavoriteStatus } from "@/actions/actions";

interface LocationWithFavorite extends LocationCardProps {
    isFavorite?: boolean;
}

const LocationListAll = ({ Locations }: { Locations: LocationCardProps[] }) => {
    const { userId } = useAuth();
    const [locationsWithFavorite, setLocationsWithFavorite] = useState<LocationWithFavorite[]>([]);
    const [loading, setLoading] = useState(true);

    // ตรวจสอบสถานะ favorite สำหรับทุกสถานที่
    useEffect(() => {
        const checkAllFavorites = async () => {
            if (!userId) {
                setLocationsWithFavorite(Locations);
                setLoading(false);
                return;
            }

            try {
                const locationsWithStatus = await Promise.all(
                    Locations.map(async (location) => {
                        try {
                            const isFavorite = await checkFavoriteStatus(userId, location.id);
                            return { ...location, isFavorite };
                        } catch (error) {
                            console.error(`Error checking favorite for location ${location.id}:`, error);
                            return { ...location, isFavorite: false };
                        }
                    })
                );
                setLocationsWithFavorite(locationsWithStatus);
            } catch (error) {
                console.error('Error checking favorites:', error);
                setLocationsWithFavorite(Locations);
            } finally {
                setLoading(false);
            }
        };

        checkAllFavorites();
    }, [Locations, userId]);

    if (loading) {
        return (
            <section className="py-4 sm:py-6 md:py-8 lg:py-10">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {[...Array(8)].map((_, index) => (
                            <LoadingCard key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 sm:py-6 md:py-8 lg:py-10">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {locationsWithFavorite.map((Location) => (
                        <div 
                            key={Location.id} 
                            className="transform transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-1.5 md:hover:-translate-y-2"
                        >
                            <LocationCard 
                                Location={Location} 
                                isAlreadyFavorite={Location.isFavorite || false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocationListAll;