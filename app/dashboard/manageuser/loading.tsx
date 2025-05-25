
import Breadcrumbs from "@/components/location/Breadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
    return (
        <>
            <header className="m-4">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Manage Users' },
                    ]}
                />
            </header>

            <div className="container mx-auto py-8">
                <div className="m-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-4 w-40 mb-6" />

                    {/* Skeleton สำหรับตาราง */}
                    <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 dark:bg-gray-800">
                            <Skeleton className="h-4 w-full col-span-1" />
                            <Skeleton className="h-4 w-full col-span-1" />
                            <Skeleton className="h-4 w-full col-span-1" />
                            <Skeleton className="h-4 w-full col-span-1" />
                            <Skeleton className="h-4 w-full col-span-1" />
                        </div>

                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-5 gap-4 p-4 border-t dark:border-gray-700"
                            >
                                <Skeleton className="h-4 w-full col-span-1" />
                                <Skeleton className="h-4 w-full col-span-1" />
                                <Skeleton className="h-4 w-full col-span-1" />
                                <Skeleton className="h-4 w-full col-span-1" />
                                <Skeleton className="h-4 w-16 col-span-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}