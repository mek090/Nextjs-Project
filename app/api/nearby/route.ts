import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ฟังก์ชันคำนวณระยะทางระหว่าง 2 จุด (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // รัศมีโลกในหน่วยกิโลเมตร
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// เพิ่มฟังก์ชันนี้
function getValidImage(images: string[]): string {
    if (!images || images.length === 0) return "/placeholder.jpg";
    const valid = images.find(img => typeof img === "string" && !img.includes("maps.googleapis.com") && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")));
    return valid || images[0] || "/placeholder.jpg";
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        const radius = parseFloat(searchParams.get('radius') || '10'); // รัศมีในการค้นหา (กิโลเมตร)
        const limit = parseInt(searchParams.get('limit') || '5'); // จำนวนสถานที่ที่ต้องการ

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
        }

        // ดึงข้อมูลสถานที่ทั้งหมด
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
                lat: true,
                lng: true,
                category: true,
                image: true,
                price: true,
                districts: true
            }
        });

        // คำนวณระยะทางและกรองสถานที่ที่อยู่ในรัศมีที่กำหนด
        const nearbyLocations = locations
            .map(location => ({
                ...location,
                image: [getValidImage(location.image)],
                distance: calculateDistance(lat, lng, location.lat, location.lng)
            }))
            .filter(location => location.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit);

        return NextResponse.json(nearbyLocations);
    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 