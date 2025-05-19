import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const googlePlacesApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  let query = "Buriram";

  // ปรับ query ตามประเภทที่เลือก
  if (category === "city") {
    query += " nightlife";
  } else if (category === "nature") {
    query += " natural park";
  } else if (category === "history") {
    query += " historical";
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googlePlacesApiKey}&type=tourist_attraction`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
