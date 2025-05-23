import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ตรวจสอบ API key
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
}

// กำหนดค่า API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // ใช้ model ที่ถูกต้อง
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      วิเคราะห์คำค้นหานี้: "${query}"
      
      กรุณาวิเคราะห์และให้ข้อมูลในรูปแบบ JSON ดังนี้:
      {
        "category": "หมวดหมู่ที่เกี่ยวข้อง (Temples, Markets, Culture, Nature, Spots)",
        "keywords": ["คำสำคัญที่เกี่ยวข้อง", "เช่น วัด, ธรรมชาติ, วัฒนธรรม"],
        "suggestions": ["คำค้นหาที่แนะนำ", "เช่น วัดพนมรุ้ง, วัดเมืองต่ำ"],
        "district": "อำเภอที่เกี่ยวข้อง (ถ้ามี)",
        "isValid": true/false, // ตรวจสอบว่าเป็นคำค้นหาที่เกี่ยวข้องกับบุรีรัมย์หรือไม่
        "reason": "เหตุผลที่แนะนำคำค้นหาเหล่านี้"
      }

      หมายเหตุ:
      - หมวดหมู่ต้องเป็นหนึ่งใน: Temples, Markets, Culture, Nature, Spots
      - ถ้าไม่เกี่ยวข้องกับบุรีรัมย์ ให้ isValid เป็น false
      - คำแนะนำควรเกี่ยวข้องกับสถานที่ท่องเที่ยวในบุรีรัมย์
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

    return NextResponse.json(analyzedData);
  } catch (error) {
    console.error('Error analyzing search query:', error);
    return NextResponse.json(
      { error: 'Failed to analyze search query', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 