'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShowMoreSection } from "@/components/dashboard/ShowMoreSection"
import { UserActivityItem } from "@/components/dashboard/UserActivityItem"

interface UserActivitiesListProps {
  activities: any[]
}

export function UserActivitiesList({ activities }: UserActivitiesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>กิจกรรมผู้ใช้</CardTitle>
      </CardHeader>
      <CardContent>
        <ShowMoreSection
          items={activities}
          initialCount={5}
          renderItem={(user) => <UserActivityItem key={user.profile_id} user={user} />}
        />
      </CardContent>
    </Card>
  )
} 