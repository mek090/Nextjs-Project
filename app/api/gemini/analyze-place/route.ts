import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { districts } from "@/utils/districts";

// ตรวจสอบ API key
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
}

// กำหนดค่า API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      business_status,
      opening_hours,
      price_level,
      photos,
    } = body;

    // แปลงที่อยู่เป็นอำเภอในจังหวัดบุรีรัมย์
    const districtMatch = districts.find(d => address.includes(d.DISTRICT_NAME));
    const district = districtMatch ? districtMatch.DISTRICT_NAME : "บุรีรัมย์";

    // ใช้ model ที่ถูกต้อง
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      วิเคราะห์ข้อมูลสถานที่ต่อไปนี้และให้คำแนะนำ:
      ชื่อสถานที่: ${name}
      ที่อยู่: ${address}
      สถานะธุรกิจ: ${business_status}
      เวลาทำการ: ${JSON.stringify(opening_hours)}
      ระดับราคา: ${price_level}

      กรุณาให้ข้อมูลในรูปแบบ JSON ดังนี้:
      {
        "thaiName": "ชื่อสถานที่ภาษาไทย",
        "description": "คำอธิบายสถานที่โดยละเอียด",
        "category": "หมวดหมู่ที่เหมาะสม (Temples, Markets, Culture, Nature, Spots)",
        "district": "อำเภอที่ตั้ง",
        "price": "ระดับราคา (0-3)",
        "selectedPhotos": [0, 1, 2] // ใส่ index ของรูปภาพที่ต้องการ (0 ถึง ${photos.length - 1})
      }

      หมายเหตุ:
      - ชื่อสถานที่ภาษาไทยควรเป็นชื่อที่คนไทยรู้จักและใช้กันทั่วไป
      - คำอธิบายควรครอบคลุมประวัติ ความสำคัญ และจุดเด่นของสถานที่
      - หมวดหมู่ต้องเป็นหนึ่งใน: Temples, Markets, Culture, Nature, Spots
      - ระดับราคา: 0 (ฟรี), 1 (ถูก), 2 (ปานกลาง), 3 (แพง)
      - เลือกรูปภาพที่สวยงามและแสดงจุดเด่นของสถานที่ (ใส่ index เป็นตัวเลขเท่านั้น)
      - ตอบกลับเฉพาะ JSON เท่านั้น ไม่ต้องมี markdown หรือ code block
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // แยก JSON ออกจาก markdown ถ้ามี
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    // แปลงข้อความ JSON เป็น object
    const analyzedData = JSON.parse(jsonMatch[0]);

    // ตรวจสอบและแปลง selectedPhotos
    let selectedPhotos = [];
    if (Array.isArray(analyzedData.selectedPhotos)) {
      // แปลง string indices เป็น numbers และกรองเฉพาะ indices ที่ถูกต้อง
      selectedPhotos = analyzedData.selectedPhotos
        .map((index: any) => parseInt(index))
        .filter((index: number) => !isNaN(index) && index >= 0 && index < photos.length);
    }

    // ถ้าไม่มีรูปภาพที่เลือก หรือเลือกไม่ถูกต้อง ให้ใช้รูปภาพทั้งหมด
    if (selectedPhotos.length === 0 && photos.length > 0) {
      selectedPhotos = photos.map((_, index) => index);
    }

    // แปลง indices เป็น photo_reference
    analyzedData.selectedPhotos = selectedPhotos.map((index: number) => photos[index]);

    // เพิ่ม district เข้าไปในข้อมูลที่จะส่งกลับ
    analyzedData.district = district;

    return NextResponse.json(analyzedData);
  } catch (error) {
    console.error('Error analyzing place:', error);
    return NextResponse.json(
      { error: 'Failed to analyze place', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 