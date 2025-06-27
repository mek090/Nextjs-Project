import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { districts } from "@/utils/districts";

// Validate API key at startup
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Type definitions
interface PlaceData {
  name: string;
  address?: string;
  business_status?: string;
  opening_hours?: any;
  price_level?: number;
  photos?: any[];
}

interface AnalyzedData {
  thaiName: string;
  description: string;
  category: string;
  district: string;
  price: string;
  selectedPhotos: any[];
}

const districtMap: Record<string, string> = {
  'Krasang': 'กระสัง',
  'Lam Plai Mat': 'ลำปลายมาศ',
  'Nang Rong': 'นางรอง',
  'Phutthaisong': 'พุทไธสง',
  'Prakhon Chai': 'ประโคนชัย',
  'Satuek': 'สตึก',
  'Ban Kruat': 'บ้านกรวด',
  'Ban Mai Chaiyaphot': 'บ้านใหม่ไชยพจน์',
  'Chaloem Phra Kiat': 'เฉลิมพระเกียรติ',
  'Huai Rat': 'ห้วยราช',
  'Khu Mueang': 'คูเมือง',
  'Lahan Sai': 'ละหานทราย',
  'Non Din Daeng': 'โนนดินแดง',
  'Non Suwan': 'โนนสุวรรณ',
  'Nong Hong': 'หนองหงส์',
  'Nong Ki': 'หนองกี่',
  'Pakham': 'ปะคำ',
  'Phlapphla Chai': 'พลับพลาชัย',
  'Mueang Buri Ram': 'บุรีรัมย์'
};

const priceLevelMap: Record<number, string> = {
  0: "ไม่มีค่าใช้จ่าย",
  1: "10-100 บาท",
  2: "101-300 บาท",
  3: "300+ บาท"
};

function extractDistrict(address: string = ""): string {
  // Try to match English district name first (from Google Places)
  const googleDistrictMatch = address.match(/([^,]+) District/);
  if (googleDistrictMatch) {
    const engDistrict = googleDistrictMatch[1].trim();
    return districtMap[engDistrict] || engDistrict;
  }

  // Fallback to Thai district name
  const districtMatch = districts.find(d => address.includes(d.DISTRICT_NAME));
  if (districtMatch) {
    return districtMatch.DISTRICT_NAME
      .replace('อำเภอ', '')
      .replace('จังหวัดบุรีรัมย์', '')
      .replace('บุรีรัมย์', '')
      .trim();
  }

  return "บุรีรัมย์"; // Default value
}

function determinePriceLevel(
  priceLevel?: number,
  name: string = "",
  address: string = "",
  category?: string
): string {
  // Use explicit price level if available
  if (priceLevel !== undefined && priceLevel >= 0 && priceLevel <= 3) {
    return priceLevelMap[priceLevel];
  }

  // Infer from category or name/address
  const nameAndAddress = (name + ' ' + address).toLowerCase();
  
  if (category === 'Temples' || 
      nameAndAddress.includes('วัด') || 
      nameAndAddress.includes('temple') ||
      nameAndAddress.includes('สวนสาธารณะ') || 
      nameAndAddress.includes('park')) {
    return "ไม่มีค่าใช้จ่าย";
  }
  
  if (category === 'Markets' || 
      nameAndAddress.includes('ตลาด') || 
      nameAndAddress.includes('market')) {
    return "10-100 บาท";
  }
  
  return "101-300 บาท"; // Default
}

function validateAndCleanResponse(text: string): AnalyzedData {
  let cleanText = text.trim()
    .replace(/```json\s*/, '')
    .replace(/```\s*$/, '');

  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response: ' + text);
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Attempted to parse:', jsonMatch[0]);
    throw new Error('Invalid JSON format from AI response');
  }
}

function selectPhotos(analyzedData: AnalyzedData, photos: any[] = []): any[] {
  if (!photos.length) return [];

  // Try to use the AI-selected photos if valid
  if (Array.isArray(analyzedData.selectedPhotos)) {
    const validIndices = analyzedData.selectedPhotos
      .map(index => typeof index === 'string' ? parseInt(index) : index)
      .filter(index => !isNaN(index) && index >= 0 && index < photos.length);
    
    if (validIndices.length > 0) {
      return validIndices.map(index => photos[index]);
    }
  }

  // Fallback to first 3 photos
  return photos.slice(0, 3);
}

export async function POST(request: Request) {
  try {
    const body: PlaceData = await request.json();
    const {
      name,
      address = "",
      business_status,
      opening_hours,
      price_level,
      photos = [],
    } = body;

    const district = extractDistrict(address);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านการท่องเที่ยวในจังหวัดบุรีรัมย์ ให้วิเคราะห์ข้อมูลสถานที่ต่อไปนี้:

ข้อมูลสถานที่:
- ชื่อ: ${name}
- ที่อยู่: ${address}
- สถานะธุรกิจ: ${business_status}
- เวลาทำการ: ${opening_hours ? JSON.stringify(opening_hours) : 'ไม่ระบุ'}
- ระดับราคาจาก Google: ${price_level !== undefined ? price_level : 'ไม่ระบุ'}
- จำนวนรูปภาพ: ${photos.length} รูป
- อำเภอ: ${district}

คำแนะนำในการวิเคราะห์:
1. ชื่อภาษาไทย: แปลชื่อให้เป็นภาษาไทยที่เข้าใจง่าย หากเป็นชื่อวัดให้ใส่คำว่า "วัด" นำหน้า
2. หมวดหมู่: จำแนกตามลักษณะ
   - Temples: วัด, ศาลเจ้า, สถานที่ศักดิ์สิทธิ์
   - Markets: ตลาด, ร้านค้า, ศูนย์การค้า
   - Culture: พิพิธภัณฑ์, แหล่งเรียนรู้, วัฒนธรรม
   - Nature: สวนสาธารณะ, ธรรมชาติ, น้ำตก
   - Spots: สถานที่ท่องเที่ยวอื่นๆ
3. ระดับราคา: ประเมินตามความเป็นจริงและข้อมูลจาก Google
4. คำอธิบาย: เขียนให้น่าสนใจ ครอบคลุมจุดเด่น ประวัติความเป็นมา
5. เลือกรูปภาพ: เลือก 10 รูปแรก หรือตามจำนวนที่มี

ตอบในรูปแบบ JSON เท่านั้น:
{
  "thaiName": "ชื่อภาษาไทยที่เหมาะสม",
  "description": "คำอธิบายโดยละเอียด 2-3 ประโยค",
  "category": "หมวดหมู่ที่เหมาะสม",
  "district": "${district}",
  "price": "ช่วงราคาหรือคำอธิบายราคา",
  "selectedPhotos": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

ห้ามใส่ markdown หรือ code block ตอบเฉพาะ JSON
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analyzedData = validateAndCleanResponse(text);
    
    // Apply defaults and validations
    analyzedData.thaiName = analyzedData.thaiName || name;
    analyzedData.description = analyzedData.description || 
      `สถานที่ท่องเที่ยวในอำเภอ${district} จังหวัดบุรีรัมย์`;
    analyzedData.category = analyzedData.category || "Spots";
    analyzedData.district = district;
    analyzedData.price = determinePriceLevel(
      price_level,
      name,
      address,
      analyzedData.category
    );
    analyzedData.selectedPhotos = selectPhotos(analyzedData, photos);

    return NextResponse.json(analyzedData);
  } catch (error) {
    console.error('Error analyzing place:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze place',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}