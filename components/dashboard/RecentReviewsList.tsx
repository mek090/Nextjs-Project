'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShowMoreSection } from "@/components/dashboard/ShowMoreSection"
import { ReviewItem } from "@/components/dashboard/ReviewItem"

interface RecentReviewsListProps {
  reviews: any[]
}

export function RecentReviewsList({ reviews }: RecentReviewsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รีวิวล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        <ShowMoreSection
          items={reviews}
          initialCount={3}
          renderItem={(review) => <ReviewItem key={review.id} review={review} />}
        />
      </CardContent>
    </Card>
  )
} 