'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TopLocationsProps {
  topRated?: {
    id: string
    name: string
    districts: string
    rating: number
    _count: {
      reviews: number
      favorites: number
    }
    image: string | string[]
  }[]
  mostFavorited?: {
    id: string
    name: string
    districts: string
    rating: number
    _count: {
      reviews: number
      favorites: number
    }
    image: string | string[]
  }[]
}

const getImageUrl = (image: string | string[] | undefined | null): string | null => {
  if (!image) return null;
  if (Array.isArray(image)) return image[0] || null;
  return image;
}

export function TopLocations({ topRated = [], mostFavorited = [] }: TopLocationsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Top Rated Locations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>สถานที่ยอดนิยม</CardTitle>
            <Link href="/dashboard/top-rated" className="text-sm text-primary hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRated?.map((location) => {
              const imageUrl = getImageUrl(location.image);
              return (
              <Link 
                key={location.id} 
                href={`/locations/${location.id}`}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    {imageUrl ? (
                    <Image
                        src={imageUrl}
                      alt={location.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{location.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{location.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({location._count.reviews} รีวิว)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{location.districts}</p>
                </div>
              </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Most Favorited Locations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>สถานที่เพิ่มในรายการโปรดมากที่สุด</CardTitle>
            <Link href="/dashboard/most-favorited" className="text-sm text-primary hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mostFavorited?.map((location) => {
              const imageUrl = getImageUrl(location.image);
              return (
              <Link 
                key={location.id} 
                href={`/locations/${location.id}`}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    {imageUrl ? (
                    <Image
                        src={imageUrl}
                      alt={location.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{location.name}</h3>
                  <div className="flex items-center mt-1">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500 mr-1" />
                    <span className="text-sm">{location._count.favorites}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ถูกเพิ่มในรายการโปรด
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{location.districts}</p>
                </div>
              </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 