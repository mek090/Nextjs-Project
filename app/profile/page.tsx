import { currentUser } from '@clerk/nextjs/server'
import db from '@/utils/db'
import { Star } from 'lucide-react'
import Link from 'next/link'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) return <p>กรุณาเข้าสู่ระบบ</p>

  const profile = await db.profile.findUnique({
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

  if (!profile) return <p>ไม่พบข้อมูลโปรไฟล์</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ของฉัน</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div>
          <ProfileForm profile={profile} userId={user.id} />
        </div>

        {/* Review History */}
        <div>
          <h2 className="text-xl font-bold mb-4">ประวัติการรีวิว</h2>
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div key={review.id} className="border-2 p-4 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-2">
                  <Link href={`/locations/${review.location.id}`} className="flex-shrink-0">
                    <img
                      src={review.location.image}
                      alt={review.location.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </Link>
                  <div>
                    <Link 
                      href={`/locations/${review.location.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {review.location.name}
                    </Link>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
            {profile.reviews.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                ยังไม่มีประวัติการรีวิว
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
