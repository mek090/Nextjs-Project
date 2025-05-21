'use client'

import { Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReviewItemProps {
  review: {
    id: string
    content: string
    rating: number
    createdAt: string
    profile: {
      firstname: string
      lastname: string
    }
  }
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {review.profile.firstname} {review.profile.lastname}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{review.rating}</span>
          </div>
        </div>
        <p className="text-sm mt-2">{review.content}</p>
      </div>
    </div>
  )
} 