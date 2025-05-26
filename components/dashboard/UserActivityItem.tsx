'use client'

import Image from "next/image"
import { Users, MessageSquare, Heart, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface UserActivityItemProps {
  user: {
    profile_id: string
    firstname: string
    lastname: string
    username: string
    profileImage: string | null
    review_count: number
    favorite_count: number
    location_views: number
    last_review: {
      id: string
      content: string
      createdAt: string
      location?: {
        id: string
        name: string
      }
    } | null
    last_favorite: {
      id: string
      createdAt: string
      location?: {
        id: string
        name: string
      }
    } | null
  }
}

const getImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;
  return image;
}

export function UserActivityItem({ user }: UserActivityItemProps) {
  const getLastActivityTime = () => {
    const reviewTime = user.last_review?.createdAt ? new Date(user.last_review.createdAt).getTime() : 0
    const favoriteTime = user.last_favorite?.createdAt ? new Date(user.last_favorite.createdAt).getTime() : 0
    const lastTime = Math.max(reviewTime, favoriteTime)
    
    if (lastTime === 0) return 'ยังไม่มีกิจกรรม'
    
    try {
      return formatDistanceToNow(new Date(lastTime), { addSuffix: true })
    } catch (error) {
      return 'ไม่สามารถแสดงเวลาได้'
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'ไม่สามารถแสดงเวลาได้'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return 'ไม่สามารถแสดงเวลาได้'
    }
  }

  const imageUrl = getImageUrl(user.profileImage);

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="relative h-12 w-12 rounded-full overflow-hidden border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${user.firstname} ${user.lastname}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {user.firstname} {user.lastname}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            กิจกรรมล่าสุด: {getLastActivityTime()}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{user.review_count}</p>
              <p className="text-xs text-muted-foreground">รีวิว</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm font-medium">{user.favorite_count}</p>
              <p className="text-xs text-muted-foreground">บันทึก</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{user.location_views}</p>
              <p className="text-xs text-muted-foreground">เข้าชม</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {user.last_review && (
            <div className="flex flex-col text-sm text-muted-foreground">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>รีวิวล่าสุด: {formatDate(user.last_review.createdAt)}</span>
              </div>
              {user.last_review.location && (
                <>
                  <Link 
                    href={`/location/${user.last_review.location.id}`}
                    className="ml-6 text-primary hover:underline"
                  >
                    {user.last_review.location.name}
                  </Link>
                  <p className="ml-6 text-sm line-clamp-2">{user.last_review.content}</p>
                </>
              )}
            </div>
          )}
          {user.last_favorite && (
            <div className="flex flex-col text-sm text-muted-foreground">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                <span>บันทึกล่าสุด: {formatDate(user.last_favorite.createdAt)}</span>
              </div>
              {user.last_favorite.location && (
                <Link 
                  href={`/location/${user.last_favorite.location.id}`}
                  className="ml-6 text-primary hover:underline"
                >
                  {user.last_favorite.location.name}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 