import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { rating: 'desc' },
            // take: 3,
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                lat: true,
                lng: true,
                districts: true,
                category: true,
                rating: true,
                googlePlaceId: true,
            }
        })

        return NextResponse.json(locations)
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}