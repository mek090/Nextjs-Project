'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumbs from '@/components/location/Breadcrumbs';

interface SearchHistory {
  id: string;
  query: string;
  createdAt: string;
  user: string;
}

interface SearchStats {
  query: string;
  _count: {
    query: number;
  };
}

interface SearchData {
  recentSearches: SearchHistory[];
  topSearches: SearchStats[];
  userTopSearches: SearchStats[];
}

export default function SearchStatsPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        if (!userId) {
          return;
        }

        // ตรวจสอบ role ของผู้ใช้
        const adminResponse = await fetch('/api/auth/check-admin');
        if (!adminResponse.ok) {
          throw new Error('Failed to check admin status');
        }
        const adminData = await adminResponse.json();

        // ถ้าไม่ใช่ admin ให้ redirect ไปหน้าแรก
        if (!adminData.isAdmin) {
          toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
          router.push('/');
          return;
        }

        // ถ้าเป็น admin ให้ดึงข้อมูลสถิติ
        const statsResponse = await fetch('/api/search/stats');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch search stats');
        }
        const statsData = await statsResponse.json();
        console.log('Search stats data:', statsData); // เพิ่ม log เพื่อดูข้อมูล
        setSearchData(statsData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [userId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!searchData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">ไม่พบข้อมูลการค้นหา</p>
      </div>
    );
  }

  return (
    <div  className="container bg-gray-50 dark:bg-gray-900">

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Most Favorited' },
        ]}
      />
      <div className="container mx-auto py-8">

        <h1 className="text-3xl font-bold mb-8">สถิติการค้นหา</h1>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">การค้นหาล่าสุด</TabsTrigger>
            <TabsTrigger value="top">ค้นหามากที่สุด</TabsTrigger>
            <TabsTrigger value="user">การค้นหาของคุณ</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>การค้นหาล่าสุด</CardTitle>
                <CardDescription>ประวัติการค้นหาล่าสุดของทุกคน</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {searchData.recentSearches && searchData.recentSearches.length > 0 ? (
                      searchData.recentSearches.map((search) => (
                        <div
                          key={search.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/?search=${encodeURIComponent(search.query)}`)}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{search.query}</span>
                            <span className="text-sm text-gray-500">ค้นหาโดย: {search.user}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(search.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">ไม่พบประวัติการค้นหา</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top">
            <Card>
              <CardHeader>
                <CardTitle>ค้นหามากที่สุด</CardTitle>
                <CardDescription>คำค้นหาที่ได้รับความนิยมมากที่สุด</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {searchData.topSearches && searchData.topSearches.length > 0 ? (
                      searchData.topSearches.map((search, index) => (
                        <div
                          key={search.query}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/?search=${encodeURIComponent(search.query)}`)}
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">{index + 1}</Badge>
                            <span className="font-medium">{search.query}</span>
                          </div>
                          <Badge variant="outline">{search._count.query} ครั้ง</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">ไม่พบข้อมูลการค้นหาที่ได้รับความนิยม</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>การค้นหาของคุณ</CardTitle>
                <CardDescription>คำค้นหาที่คุณค้นหาบ่อยที่สุด</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {searchData.userTopSearches && searchData.userTopSearches.length > 0 ? (
                      searchData.userTopSearches.map((search, index) => (
                        <div
                          key={search.query}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/?search=${encodeURIComponent(search.query)}`)}
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">{index + 1}</Badge>
                            <span className="font-medium">{search.query}</span>
                          </div>
                          <Badge variant="outline">{search._count.query} ครั้ง</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">ไม่พบประวัติการค้นหาของคุณ</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 