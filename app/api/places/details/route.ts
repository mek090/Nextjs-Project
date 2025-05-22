import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("place_id");
  const googlePlacesApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,photos,rating,user_ratings_total,opening_hours,business_status,geometry,reviews&key=${googlePlacesApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json({ error: "Error fetching place details" }, { status: 500 });
  }
} 