import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { string } from "zod";

// ตรวจสอบ API key
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY is not defined");
}

// กำหนดค่า API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request: Request) {
  let query: string = "";
  try {
    // const { query } = await request.json();
    const body = await request.json();
    query = body.query;

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
คุณเป็นผู้ช่วยในการวิเคราะห์คำค้นหาสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์ 
ให้วิเคราะห์คำค้นหาต่อไปนี้และจัดกลุ่มข้อมูลเพื่อใช้ในการค้นหาฐานข้อมูล:

คำค้นหา: "${query}"

หมวดหมู่หลักที่ใช้ในระบบ:
- Temples: วัด, ศาลเจ้า, สถานที่ศักดิ์สิทธิ์
- Markets: ตลาด, ร้านค้า, ศูนย์การค้า, คาเฟ่, ร้านอาหาร
- Culture: พิพิธภัณฑ์, แหล่งเรียนรู้, วัฒนธรรม, ประวัติศาสตร์
- Nature: สวนสาธารณะ, ธรรมชาติ, น้ำตก, ภูเขา
- Spots: สถานที่ท่องเที่ยวอื่นๆ, โรงแรม, ที่พัก

อำเภอในจังหวัดบุรีรัมย์:
เมืองบุรีรัมย์, กระสัง, คูเมือง, ชำนิ, บ้านกรวด, บ้านใหม่ไชยพจน์, บ้านด่าน, ปะคำ, ประโคนชัย, พลับพลาไชย, พุทไธสง, ภูสิงห์, ลำปลายมาศ, สตึก, หนองกี่, หนองหงส์, เฉลิมพระเกียรติ, แคนดง, โนนดินแดง, โนนสุวรรณ, ห้วยราช, ลาหานทราย, นางรอง

คำแนะนำการวิเคราะห์:
1. ปรับคำค้นหาให้เป็นรูปแบบมาตรฐาน
2. ระบุหมวดหมู่หลัก
3. ตรวจหาชื่ออำเภอที่กล่าวถึง
4. ระบุคุณสมบัติพิเศษที่ต้องการ
5. กำหนดประเภทสถานที่ให้ชัดเจน

ตัวอย่างการปรับคำ:
- "คาเฟ่", "คาเฟ", "กาแฟ" → "คาเฟ่"
- "ร้านอาหาร", "อาหาร", "กิน" → "ร้านอาหาร"
- "วัด", "วัดพระ", "temple" → "วัด"
- "ตลาด", "ช็อปปิ้ง", "ซื้อของ" → "ตลาด"
- "ที่เที่ยว", "สถานที่ท่องเที่ยว" → "สถานที่ท่องเที่ยว"
- "ธรรมชาติ", "ป่า", "เขียว" → "ธรรมชาติ"

ตอบในรูปแบบ JSON เท่านั้น:
{
  "normalizedQuery": "คำค้นหาที่ปรับแล้ว",
  "category": "หมวดหมู่หลัก (Temples/Markets/Culture/Nature/Spots)",
  "location": "ชื่ออำเภอหรือ null",
  "features": ["รายการคุณสมบัติพิเศษ"],
  "type": "ประเภทสถานที่ที่ชัดเจน",
  "searchTerms": ["คำสำคัญสำหรับค้นหาในฐานข้อมูล"],
  "priority": "high/medium/low - ความสำคัญของการค้นหา"
}

ห้ามใส่ markdown หรือ code block ตอบเฉพาะ JSON
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // ทำความสะอาดข้อความและแยก JSON
    let cleanText = text.trim();
    cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI Response:", text);
      throw new Error("Failed to extract JSON from AI response");
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse:", jsonMatch[0]);
      throw new Error("Invalid JSON format from AI response");
    }

    // ตรวจสอบและเพิ่มข้อมูลที่จำเป็น
    if (!analysis.normalizedQuery) {
      analysis.normalizedQuery = query;
    }
    
    if (!analysis.category) {
      analysis.category = "Spots";
    }
    
    if (!analysis.type) {
      analysis.type = "สถานที่ท่องเที่ยว";
    }
    
    if (!Array.isArray(analysis.features)) {
      analysis.features = [];
    }
    
    if (!Array.isArray(analysis.searchTerms)) {
      analysis.searchTerms = [analysis.normalizedQuery];
    }
    
    if (!analysis.priority) {
      analysis.priority = "medium";
    }

    // เพิ่มข้อมูลเสริมสำหรับการค้นหา
    analysis.originalQuery = query;
    analysis.timestamp = new Date().toISOString();

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing search query:", error);
    
    // Fallback response ในกรณีที่ AI ล้มเหลว
    const fallbackAnalysis = {
      normalizedQuery: query,
      category: "Spots",
      location: null,
      features: [],
      type: "สถานที่ท่องเที่ยว",
      searchTerms: [query],
      priority: "medium",
      originalQuery: query,
      timestamp: new Date().toISOString(),
      fallback: true
    };

    return NextResponse.json(fallbackAnalysis);
  }
}