import { fetchLocationDetail } from "@/actions/actions"
import { notFound } from "next/navigation"
import EditLocationForm from "@/components/location/EditLocationForm"
import Breadcrumbs from "@/components/location/Breadcrumbs"

export const dynamic = 'force-dynamic'

const EditLocation = async ({ params }: { params: { id: string } }) => {
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
                        { label: 'Edit Location' },
                    ]}
                />
            </header>

            <div className="border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-800">
                    แก้ไขสถานที่ท่องเที่ยว
                </h1>
                <p className="text-gray-600 mt-2">แก้ไขข้อมูลสถานที่ท่องเที่ยว</p>
            </div>

            <EditLocationForm location={location} />
        </section>
    )
}

export default EditLocation 