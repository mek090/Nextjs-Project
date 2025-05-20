import { fetchLocationDetail, deleteLocationAction } from "@/actions/actions"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

export const dynamic = 'force-dynamic'

const DeleteLocation = async ({ params }: { params: { id: string } }) => {
    const location = await fetchLocationDetail({ id: params.id })

    if (!location) {
        notFound()
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            <header className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Manage Location', href: '/dashboard/managelocation' },
                        { label: 'Delete Location' },
                    ]}
                />
            </header>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                        <Trash2 className="h-6 w-6" />
                        ยืนยันการลบสถานที่
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            คุณกำลังจะลบสถานที่ <span className="font-semibold">{location.name}</span>
                        </p>
                        <p className="text-red-600">
                            การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบสถานที่นี้?
                        </p>
                        <div className="flex justify-end gap-4 mt-6">
                            <form action={deleteLocationAction}>
                                <input type="hidden" name="id" value={location.id} />
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    ยืนยันการลบ
                                </Button>
                            </form>
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                ยกเลิก
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

export default DeleteLocation 