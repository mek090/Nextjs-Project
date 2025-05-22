import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { districts } from "@/utils/districts";

// ตรวจสอบ API key
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
}

// กำหนดค่า API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      rating,
      user_ratings_total,
      business_status,
      opening_hours,
      price_level,
      // reviews,
      photos,
    } = body;

    // แปลงที่อยู่เป็นอำเภอในจังหวัดบุรีรัมย์
    const districtMatch = districts.find(d => address.includes(d.DISTRICT_NAME));
    const district = districtMatch ? districtMatch.DISTRICT_NAME : "บุรีรัมย์";

    // สร้าง prompt สำหรับ Gemini
    const prompt = `
      วิเคราะห์ข้อมูลสถานที่ท่องเที่ยวต่อไปนี้และให้คำแนะนำในการจัดหมวดหมู่และข้อมูลที่ควรบันทึก:

      ชื่อสถานที่: ${name}
      ที่อยู่: ${address}
      อำเภอ: ${district}
      คะแนนรีวิว: ${rating || 'ไม่มีข้อมูล'}
      จำนวนรีวิว: ${user_ratings_total || 0}
      สถานะ: ${business_status || 'ไม่มีข้อมูล'}
      ราคา: ${price_level ? `ระดับ ${price_level}` : 'ไม่มีข้อมูล'}
      เวลาทำการ: ${opening_hours?.weekday_text?.join('\n') || 'ไม่มีข้อมูล'}

      กรุณาวิเคราะห์และให้ข้อมูลต่อไปนี้:
      1. หมวดหมู่ที่เหมาะสม (Culture=วัฒนธรรม, Nature=ธรรมชาติ, Spots=สถานที่ท่องเที่ยว, Markets=ตลาด, Temples=วัด)
      2. คำอธิบายสถานที่ที่กระชับและน่าสนใจ (ภาษาไทย)
      3. ช่วงราคาที่เหมาะสม (0=ฟรี, 0-100=ถูก, 100-300=ปานกลาง, 300-500=แพง, 500+=แพงมาก)
      4. รูปภาพที่ควรใช้ (เลือกจาก ${photos?.length || 0} รูปที่มี)
      
      ตอบในรูปแบบ JSON เท่านั้น โดยไม่ต้องมี markdown formatting หรือ code block:
      {
        "category": "หมวดหมู่ที่เหมาะสม",
        "description": "คำอธิบายสถานที่ (ภาษาไทย)",
        "price": "ช่วงราคา",
        "selectedPhotos": [index ของรูปที่ควรใช้]
      }
    `;

    // เรียกใช้ Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // ทำความสะอาดข้อความ JSON
    const jsonText = text
      .replace(/```json\n?/g, '') // ลบ markdown code block
      .replace(/```\n?/g, '')     // ลบ markdown code block
      .trim();                    // ลบช่องว่างที่ไม่จำเป็น

    // แปลงข้อความ JSON เป็น object
    const analyzedData = JSON.parse(jsonText);

    // แปลง index ของรูปภาพเป็น photo_reference
    analyzedData.selectedPhotos = analyzedData.selectedPhotos.map((index: number) => photos[index]);

    return NextResponse.json(analyzedData);
  } catch (error) {
    console.error("Error analyzing place:", error);
    return NextResponse.json(
      { error: "Error analyzing place", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 