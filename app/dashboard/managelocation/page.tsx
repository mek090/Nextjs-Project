import { fetchLocation } from "@/actions/actions"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

const ManageLocation = async () => {
    const locations = await fetchLocation({})

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            <header className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Manage Location' },
                    ]}
                />
            </header>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-800">จัดการสถานที่ท่องเที่ยว</h1>
                <Link href="/locations/create">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        เพิ่มสถานที่ใหม่
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                    <Card key={location.id} className="overflow-hidden">
                        <div className="relative h-48">
                            <img
                                src={location.image[0]}
                                alt={location.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">{location.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="dark:text-gray-200 mb-4 line-clamp-2">{location.description}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-sm dark:text-gray-200">
                                    <p>{location.districts}</p>
                                    {location.openTime && location.closeTime && (
                                        <p>{location.openTime} - {location.closeTime}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/locations/edit/${location.id}`}>
                                        <Button variant="outline" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/locations/delete/${location.id}`}>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export default ManageLocation 