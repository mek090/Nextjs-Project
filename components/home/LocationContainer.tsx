"use client";

import { fetchLocation } from "@/actions/actions"
import { useState, useEffect } from "react"
import { LocationCardProps } from "@/utils/types"
import { useSearchParams } from "next/navigation";
import { string } from "zod";

import LocationList from "./LocationList"
import LoadingCard from "../card/LoadingCard"
import Hero from "../hero/Hero";
import CategoryList from "./CategoryList";
import EmptyList from "./EmptyList";

const LocationContainer = () => {
    const [locations, setLocations] = useState<LocationCardProps[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        const loadLocations = async () => {
            try {
                setIsLoading(true)
                const data = await fetchLocation({ search, category })
                setLocations(data)
            } catch (error) {
                console.error("Failed to fetch locations:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadLocations()
    }, [search, category])

    return (
        <div>
            <Hero locations={locations} />
            <CategoryList />
            {isLoading ? (
                <section className="py-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, index) => (
                                <LoadingCard key={index} />
                            ))}
                        </div>
                    </div>
                </section>
            ) : locations.length === 0 ? (
                <EmptyList heading="ไม่พบสถานที่ที่คุณค้นหา"/>
            ) : (
                <LocationList Locations={locations} />
            )}
        </div>
    )
}

export default LocationContainer