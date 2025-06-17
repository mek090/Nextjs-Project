// import { currentUser } from '@clerk/nextjs/server'
// import { prisma } from '@/lib/prisma'
// import { Star } from 'lucide-react'
// import Link from 'next/link'
// import ProfileForm from '@/components/profile/ProfileForm'
// import ProfileAnalysis from '@/components/profile/ProfileAnalysis'

// export default async function ProfilePage() {
//   const user = await currentUser()
//   if (!user) return <p>กรุณาเข้าสู่ระบบ</p>

//   const profile = await prisma.profile.findUnique({
//     where: { clerkId: user.id },
//     include: {
//       reviews: {
//         include: {
//           location: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             }
//           }
//         },
//         orderBy: {
//           createdAt: 'desc'
//         }
//       }
//     }
//   })

//   if (!profile) return <p>ไม่พบข้อมูลโปรไฟล์</p>

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">โปรไฟล์ของฉัน</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Profile Form */}
//         <div className="lg:col-span-1">
//           <ProfileForm profile={profile} userId={user.id} />
//         </div>

//         {/* Profile Analysis */}
//         <div className="lg:col-span-2">
//           <ProfileAnalysis userId={user.id} />
//         </div>
//       </div>
//     </div>
//   )
// }



import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Star, User, Settings, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import ProfileForm from '@/components/profile/ProfileForm'
import ProfileAnalysis from '@/components/profile/ProfileAnalysis'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'

export default async function ProfilePage() {
  const user = await currentUser()
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md">
          <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้าโปรไฟล์</p>
          <Link href="/sign-in" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    )
  }
  
  const profile = await prisma.profile.findUnique({
    where: { clerkId: user.id },
    include: {
      reviews: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md">
          <User className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">ไม่พบข้อมูลโปรไฟล์</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">ไม่พบข้อมูลโปรไฟล์ของคุณในระบบ กรุณาติดต่อผู้ดูแลระบบ</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Tabs & Content */}
          <Tabs defaultValue="analysis" className="w-full">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md">
              <TabsList className="grid grid-cols-2 w-full md:w-80 mb-0">
                <TabsTrigger value="analysis" className="flex items-center justify-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100">
                  <ClipboardList className="h-4 w-4" />
                  <span>ข้อมูลการใช้งาน</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center justify-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100">
                  <Settings className="h-4 w-4" />
                  <span>ตั้งค่าโปรไฟล์</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="analysis" className="mt-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-md">
              
                <ProfileAnalysis userId={user.id} />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-md">
                <div className="max-w-2xl mx-auto">
                  
                  <ProfileForm profile={profile} userId={user.id} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}