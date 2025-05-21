import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Breadcrumbs from "@/components/location/Breadcrumbs"

export const dynamic = 'force-dynamic'

export default async function MostFavoritedLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: {
      favorites: {
        _count: 'desc'
      }
    },
    select: {
      id: true,
      name: true,
      image: true,
      districts: true,
      rating: true,
      _count: {
        select: {
          reviews: true,
          favorites: true
        }
      }
    }
  })

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Most Favorited' },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">สถานที่เพิ่มในรายการโปรดมากที่สุด</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Link 
            key={location.id} 
            href={`/locations/${location.id}`}
            className="block"
          >
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <div className="relative h-48 w-full">
                {location.image ? (
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{location.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span>{location._count.favorites}</span>
                  <span className="text-muted-foreground">
                    ถูกเพิ่มในรายการโปรด
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{location.districts}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 