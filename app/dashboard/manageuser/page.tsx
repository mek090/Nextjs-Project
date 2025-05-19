import { currentUser } from '@clerk/nextjs/server'
import db from '@/utils/db'
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
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id }
  })
  if (!profile || profile.role !== 'admin') redirect('/')

  // ดึงข้อมูล users ทั้งหมด
  const users = await db.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน</h1>
      <UserManagementTable users={users} />
    </div>
  )
} 