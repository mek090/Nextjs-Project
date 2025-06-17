import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ดึงข้อมูลโปรไฟล์และพฤติกรรมของผู้ใช้
        const profile = await prisma.profile.findUnique({
            where: { clerkId: user.id },
            include: {
                reviews: {
                    include: {
                        location: true
                    }
                },
                favorites: {
                    include: {
                        location: true
                    }
                }
            }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // วิเคราะห์ประเภทสถานที่ที่ผู้ใช้ชอบ
        const categoryPreferences = profile.favorites.reduce((acc, fav) => {
            acc[fav.location.category] = (acc[fav.location.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // วิเคราะห์อำเภอที่ผู้ใช้ชอบ
        const districtPreferences = profile.favorites.reduce((acc, fav) => {
            acc[fav.location.districts] = (acc[fav.location.districts] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // หาประเภทและอำเภอที่ผู้ใช้ชอบที่สุด
        const favoriteCategory = Object.entries(categoryPreferences)
            .sort(([,a], [,b]) => b - a)[0]?.[0];
        const favoriteDistrict = Object.entries(districtPreferences)
            .sort(([,a], [,b]) => b - a)[0]?.[0];

        // ค้นหาสถานที่แนะนำ
        const recommendedLocations = await prisma.location.findMany({
            where: {
                OR: [
                    { category: favoriteCategory },
                    { districts: favoriteDistrict }
                ],
                NOT: {
                    id: {
                        in: profile.favorites.map(fav => fav.locationId)
                    }
                }
            },
            orderBy: {
                rating: 'desc'
            },
            take: 8
        });

        return NextResponse.json({
            recommendedLocations,
            userPreferences: {
                favoriteCategory,
                favoriteDistrict,
                categoryPreferences,
                districtPreferences
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get recommendations' },
            { status: 500 }
        );
    }
} 