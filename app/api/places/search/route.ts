import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // เรียกใช้ Google Places API Text Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=14.9939,103.1029&radius=50000&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }

    return NextResponse.json({ results: data.results });
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json(
      { error: 'Failed to search places' },
      { status: 500 }
    );
  }
}