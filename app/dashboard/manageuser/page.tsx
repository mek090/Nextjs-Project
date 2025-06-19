import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import UserManagementTable from '@/components/dashboard/UserManagementTable'
import { SignInButton } from '@clerk/nextjs'
import { Users, Shield, UserCheck, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Breadcrumbs from '@/components/location/Breadcrumbs'

export default async function ManageUserPage() {
  const user = await currentUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                จำเป็นต้องเข้าสู่ระบบ
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้าจัดการผู้ใช้งาน
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <SignInButton mode="modal">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  เข้าสู่ระบบ
                </button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ตรวจสอบว่าเป็น admin หรือไม่
  const profile = await prisma.profile.findUnique({
    where: { clerkId: user.id }
  })
  
  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // ดึงข้อมูล users ทั้งหมด
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // คำนวณสถิติ
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.role === 'user').length,
    recent: users.filter(u => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(u.createdAt) > weekAgo
    }).length
  }

  return (
    <div className="container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: 'หน้าหลัก', href: '/' },
            { label: 'แดชบอร์ด', href: '/dashboard' },
            { label: 'จัดการผู้ใช้งาน' },
          ]}
        />

        <div className="mt-8 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              จัดการผู้ใช้งาน
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            จัดการและควบคุมผู้ใช้งานในระบบ
          </p>
        </div>

        {/* สถิติภาพรวม */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    ผู้ใช้งานทั้งหมด
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    ผู้ดูแลระบบ
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.admins}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    ผู้ใช้งานทั่วไป
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    ผู้ใช้ใหม่ (7 วัน)
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.recent}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ตารางผู้ใช้งาน */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">
                    รายชื่อผู้ใช้งาน
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    จัดการและแก้ไขข้อมูลผู้ใช้งานในระบบ
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 border-0 px-3 py-1 font-semibold"
              >
                {users.length} ผู้ใช้งาน
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <UserManagementTable users={users} />
            </div>
          </CardContent>
        </Card>

        {/* ข้อมูลเพิ่มเติม */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>สิทธิ์การเข้าถึง</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">ผู้ดูแลระบบ</span>
                  <Badge variant="destructive">{stats.admins} คน</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">ผู้ใช้งานทั่วไป</span>
                  <Badge variant="secondary">{stats.active} คน</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center font-semibold">
                    <span>รวมทั้งหมด</span>
                    <Badge variant="outline">{stats.total} คน</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>กิจกรรมล่าสุด</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">ผู้ใช้ใหม่ในสัปดาห์นี้</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {stats.recent} คน
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">อัตราการเติบโต</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stats.total > 0 ? ((stats.recent / stats.total) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}