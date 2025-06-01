import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("place_id");

  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 });
  }

  try {
    const location = await prisma.location.findFirst({
      where: {
        googlePlaceId: placeId
      }
    });

    return NextResponse.json({ isSaved: !!location });
  } catch (error) {
    console.error("Error checking saved place:", error);
    return NextResponse.json({ error: "Error checking saved place" }, { status: 500 });
  }
} 