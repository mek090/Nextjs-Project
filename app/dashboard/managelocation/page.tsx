import { fetchLocation } from "@/actions/actions"
import Breadcrumbs from "@/components/location/Breadcrumbs"
import { SignInButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ManageLocationHeader from "@/components/dashboard/ManageLocationHeader"
import ManageLocationStats from "@/components/dashboard/ManageLocationStats"
import LocationGrid from "@/components/dashboard/LocationGrid"

export const dynamic = 'force-dynamic'

export default async function ManageLocation(props: any) {
  const resolvedProps = await Promise.resolve(props);
  let searchParams = resolvedProps.searchParams;
  if (searchParams && typeof searchParams.then === 'function') {
    searchParams = await searchParams;
  }
  const search = searchParams?.search || '';
  const user = await currentUser()

  if (!user) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <SignInButton mode="modal" />
        </div>
      </section>
    )
  }

  // ตรวจสอบว่าเป็น admin หรือไม่
  const profile = await prisma.profile.findUnique({
    where: { clerkId: user.id }
  })
  if (!profile || profile.role !== 'admin') redirect('/')

  // ดึงข้อมูล locations ทั้งหมด
  const locations = await prisma.location.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { districts: { contains: search, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <section className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
      <header>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Manage Location' },
          ]}
        />
      </header>

      <div className="space-y-6">
        <ManageLocationHeader />
        <ManageLocationStats locationCount={locations.length} />
        <LocationGrid locations={locations} />
      </div>
    </section>
  )
}