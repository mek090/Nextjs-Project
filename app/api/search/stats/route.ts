import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูลผู้ใช้
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    if (profile.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // ดึงสถิติการค้นหาทั้งหมด
    const allSearchStats = await prisma.searchHistory.groupBy({
      by: ['query'],
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: 10,
    });

    // ดึงสถิติการค้นหาของผู้ใช้คนนี้
    const userSearchStats = await prisma.searchHistory.groupBy({
      by: ['query'],
      where: {
        profileId: profile.clerkId,
      },
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: 10,
    });

    // ดึงประวัติการค้นหาล่าสุดทั้งหมด
    const recentSearches = await prisma.searchHistory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        profile: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return NextResponse.json({
      recentSearches: recentSearches.map(search => ({
        id: search.id,
        query: search.query,
        createdAt: search.createdAt,
        user: `${search.profile.firstname} ${search.profile.lastname}`,
      })),
      topSearches: allSearchStats,
      userTopSearches: userSearchStats,
    });
  } catch (error) {
    console.error('Error fetching search stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search statistics' },
      { status: 500 }
    );
  }
} 