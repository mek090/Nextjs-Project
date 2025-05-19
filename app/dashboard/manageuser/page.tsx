import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import UserManagementTable from '@/components/dashboard/UserManagementTable'
import { SignInButton } from '@clerk/nextjs'

export default async function ManageUserPage() {
  const user = await currentUser()

  if (!user) {
    return (
      <SignInButton mode="modal" ></SignInButton>
    )

  }
  // ตรวจสอบว่าเป็น admin หรือไม่
  const profile = await prisma.profile.findUnique({
    where: { clerkId: user.id }
  })
  if (!profile || profile.role !== 'admin') redirect('/')

  // ดึงข้อมูล users ทั้งหมด
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน</h1>
      <p className="text-gray-600 mb-4">มีผู้ใช้งานทั้งหมด {users.length} คน</p>
      <UserManagementTable users={users} />
    </div>
  )
} 