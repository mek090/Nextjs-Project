
// import { NextResponse } from "next/server";
// import prisma from "@/utils/db";
// import { auth } from "@clerk/nextjs/server";
// import { toggleFavoriteAction, checkFavoriteStatus } from "@/actions/actions";

// export async function POST(request: Request) {
//     try {
//         const { userId } = auth();
//         if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//         const { locationId, isFavorite } = await request.json();

//         await toggleFavoriteAction(userId, locationId, isFavorite);

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error("Favorite error:", error);
//         return NextResponse.json(
//             { error: "Failed to update favorite" },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(request: Request) {
//     try {
//         const { userId } = auth();
//         if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//         const { searchParams } = new URL(request.url);
//         const locationId = searchParams.get("locationId");
//         if (!locationId) return NextResponse.json({ error: "Location ID required" }, { status: 400 });

//         const isFavorite = await checkFavoriteStatus(userId, locationId);
//         return NextResponse.json({ isFavorite });
//     } catch (error) {
//         console.error("Check favorite error:", error);
//         return NextResponse.json(
//             { error: "Failed to check favorite status" },
//             { status: 500 }
//         );
//     }
// }