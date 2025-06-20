import { fetchLocationDetail } from "@/actions/actions"
import { notFound } from "next/navigation"
import EditLocationForm from "@/components/location/EditLocationForm"
import Breadcrumbs from "@/components/location/Breadcrumbs"
// import EditLocationHeade

export const dynamic = 'force-dynamic'

const EditLocation = async (props: any) => {
    const resolvedProps = await Promise.resolve(props);
    const params = resolvedProps.params as { id: string };
    const location = await fetchLocationDetail({ id: params.id })
    
    if (!location) {
        notFound()
    }

    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <header className="mb-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Manage Location', href: '/dashboard/managelocation' },
                            { label: 'Edit Location' },
                        ]}
                    />
                </header>
                
                {/* <EditLocationHeader locationName={location.name} /> */}
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <EditLocationForm location={location} />
                </div>
            </div>
        </section>
    )
}

export default EditLocation