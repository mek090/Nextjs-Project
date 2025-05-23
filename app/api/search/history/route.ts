import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Save search history
    const searchHistory = await prisma.searchHistory.create({
      data: {
        query,
        profileId: userId,
      },
    });

    return NextResponse.json(searchHistory);
  } catch (error) {
    console.error("Error saving search history:", error);
    return NextResponse.json(
      { error: "Error saving search history", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's search history
    const searchHistory = await prisma.searchHistory.findMany({
      where: {
        profileId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Get last 10 searches
    });

    return NextResponse.json(searchHistory);
  } catch (error) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      { error: "Error fetching search history", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 