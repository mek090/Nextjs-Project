import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, MapPin, Star } from "lucide-react"
import { getDashboardStats } from "@/actions/actions"
import { formatDistanceToNow } from "date-fns"
import { links4 } from "@/utils/links"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SignInButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { findRoleprofile } from "@/actions/actions"
import { prisma } from "@/lib/prisma"
import Breadcrumbs from "@/components/location/Breadcrumbs"

export const dynamic = 'force-dynamic'





const Dashboard = async () => {
  const stats = await getDashboardStats()
  const user = await currentUser();
  // if (!user) {
  //   return (
  //     <SignInButton mode="modal" ></SignInButton>
  //   )

  // }
  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id
    }
  })
  if (!profile || profile.role !== 'admin') redirect('/')


  // ตรวจสอบว่าเป็น admin หรือไม่
  // const profile = await prisma.profile.findUnique({
  //   where: { clerkId: user.id }
  // })
  // if (!profile || profile.role !== 'admin') redirect('/')




  return (




    <div className="p-6 space-y-6">
      <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Dashboard'},
                    ]}
                />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Welcome back, Admin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlaces}</div>
            <p className="text-xs text-muted-foreground">Total locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">Total favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">Total reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.profile.firstname} {activity.profile.lastname} reviewed {activity.location.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {links4.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 justify-center rounded-lg border p-4 hover:bg-accent disabled:opacity-50"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}

          </div>
        </CardContent>
      </Card>
    </div >
  )
}

export default Dashboard