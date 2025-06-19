import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Breadcrumbs from "@/components/location/Breadcrumbs"

const loading = () => {
    return (
        <div className="container p-6 space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Dashboard' },
                ]}
            />

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 w-20 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, idx) => (
                            <Skeleton key={idx} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* สถานที่ยอดนิยม Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>สถานที่ยอดนิยม</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, idx) => (
                            <Skeleton key={idx} className="h-6 w-full" />
                        ))}
                    </CardContent>
                </Card>

                {/* สถานที่เพิ่มในรายการโปรดมากที่สุด Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>สถานที่เพิ่มในรายการโปรดมากที่สุด</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {[...Array(4)].map((_, idx) => (
                            <Skeleton key={idx} className="h-4 w-full" />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* กิจกรรมผู้ใช้ Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle>กิจกรรมผู้ใช้</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {[...Array(3)].map((_, idx) => (
                        <Skeleton key={idx} className="h-5 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default loading
