// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get("query") || "ท่องเที่ยว";
//   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

//   // ตั้งค่าพิกัดศูนย์กลางของบุรีรัมย์และรัศมีการค้นหา (ประมาณ 50 กม.)
//   const buriramLocation = "14.993333,103.103333"; // พิกัดจังหวัดบุรีรัมย์
//   const radius = 50000; // 50 กิโลเมตร

//   try {
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
//       `query=${encodeURIComponent(query + " บุรีรัมย์")}&` + // เพิ่มคำว่า บุรีรัมย์ ติดไปด้วย
//       `key=${apiKey}&` +
//       `location=${buriramLocation}&` +
//       `radius=${radius}&` +
//       `region=th` // ระบุประเทศไทย
//     );
    
//     if (!response.ok) {
//       throw new Error(`Failed to fetch places: ${response.statusText}`);
//     }
    
//     const data = await response.json();
    
//     // กรองผลลัพธ์เฉพาะที่อยู่ในจังหวัดบุรีรัมย์ (เพิ่มความมั่นใจ)
//     const filteredResults = data.results?.filter((place: any) => 
//       place.formatted_address?.includes("บุรีรัมย์") || 
//       place.formatted_address?.includes("Buriram")
//     ) || [];
    
//     return NextResponse.json({
//       ...data,
//       results: filteredResults
//     });
//   } catch (error) {
//     console.error("Error fetching places:", error);
//     return NextResponse.json(
//       { error: "Error fetching places data" },
//       { status: 500 }
//     );
//   }
// }