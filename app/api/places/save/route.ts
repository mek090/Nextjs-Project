import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      districts,
      lat,
      lng,
      price,
      image,
      rating,
      openTime,
      closeTime,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!districts) {
      return NextResponse.json(
        { error: "Districts is required" },
        { status: 400 }
      );
    }

    // Create new location
    const location = await prisma.location.create({
      data: {
        name,
        description,
        category,
        districts,
        lat: lat || 0,
        lng: lng || 0,
        price: price || '0',
        image: image || [],
        // rating: rating || 0,
        openTime: openTime || null,
        closeTime: closeTime || null,
        profileId: userId,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("Error saving place:", error);
    return NextResponse.json(
      { error: "Error saving place", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 