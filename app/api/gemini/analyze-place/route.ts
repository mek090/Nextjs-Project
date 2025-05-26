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
คุณเป็นผู้เชี่ยวชาญด้านการท่องเที่ยวในจังหวัดบุรีรัมย์ ให้วิเคราะห์ข้อมูลสถานที่ต่อไปนี้:

ข้อมูลสถานที่:
- ชื่อ: ${name}
- ที่อยู่: ${address}
- สถานะธุรกิจ: ${business_status}
- เวลาทำการ: ${opening_hours ? JSON.stringify(opening_hours) : 'ไม่ระบุ'}
- ระดับราคาจาก Google: ${price_level || 'ไม่ระบุ'}
- จำนวนรูปภาพ: ${photos.length} รูป

คำแนะนำในการวิเคราะห์:
1. ชื่อภาษาไทย: แปลชื่อให้เป็นภาษาไทยที่เข้าใจง่าย หากเป็นชื่อวัดให้ใส่คำว่า "วัด" นำหน้า
2. หมวดหมู่: จำแนกตามลักษณะ
   - Temples: วัด, ศาลเจ้า, สถานที่ศักดิ์สิทธิ์
   - Markets: ตลาด, ร้านค้า, ศูนย์การค้า
   - Culture: พิพิธภัณฑ์, แหล่งเรียนรู้, วัฒนธรรม
   - Nature: สวนสาธารณะ, ธรรมชาติ, น้ำตก
   - Spots: สถานที่ท่องเที่ยวอื่นๆ
3. ระดับราคา: ประเมินตามความเป็นจริงและข้อมูลจาก Google
   - หากมีข้อมูลราคาจาก Google ให้ใช้ค่านั้น
   - หากไม่มี ให้ประเมินตามประเภทสถานที่:
     * "ฟรี" สำหรับ วัด, สวนสาธารณะ, อนุสาวรีย์
     * "10-100 บาท" สำหรับ พิพิธภัณฑ์เล็ก, ตลาดท้องถิ่น
     * "101-300 บาท" สำหรับ สวนสนุก, ร้านอาหารทั่วไป  
     * "300+ บาท" สำหรับ รีสอร์ท, ร้านอาหารหรู
4. คำอธิบาย: เขียนให้น่าสนใจ ครอบคลุมจุดเด่น ประวัติความเป็นมา
5. เลือกรูปภาพ: เลือก 3 รูปแรก หรือตามจำนวนที่มี

ตอบในรูปแบบ JSON เท่านั้น:
{
  "thaiName": "ชื่อภาษาไทยที่เหมาะสม",
  "description": "คำอธิบายโดยละเอียด 2-3 ประโยค",
  "category": "หมวดหมู่ที่เหมาะสม",
  "district": "${district}",
  "price": "ช่วงราคาหรือคำอธิบายราคา เช่น 'ฟรี', '50-100 บาท', '200+ บาท'",
  "selectedPhotos": [0, 1, 2, 3, 4]
}

ห้ามใส่ markdown หรือ code block ตอบเฉพาะ JSON
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // ทำความสะอาดข้อความก่อนแปลง JSON
    let cleanText = text.trim();
    
    // ลบ markdown code block ถ้ามี
    cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // แยก JSON ออกจากข้อความ
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response: ' + text);
    }
    
    // แปลงข้อความ JSON เป็น object
    let analyzedData;
    try {
      analyzedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0]);
      throw new Error('Invalid JSON format from AI response');
    }

    // ตรวจสอบและแปลง selectedPhotos
    let selectedPhotos = [];
    if (Array.isArray(analyzedData.selectedPhotos) && photos.length > 0) {
      // แปลง string indices เป็น numbers และกรองเฉพาะ indices ที่ถูกต้อง
      selectedPhotos = analyzedData.selectedPhotos
        .map((index) => {
          const numIndex = typeof index === 'string' ? parseInt(index) : index;
          return numIndex;
        })
        .filter((index) => !isNaN(index) && index >= 0 && index < photos.length);
    }

    // ถ้าไม่มีรูปภาพที่เลือก หรือเลือกไม่ถูกต้อง ให้ใช้รูปภาพที่มี
    if (selectedPhotos.length === 0 && photos.length > 0) {
      // เลือกรูป 3 รูปแรก หรือทั้งหมดถ้าน้อยกว่า 3
      const maxPhotos = Math.min(3, photos.length);
      selectedPhotos = Array.from({ length: maxPhotos }, (_, i) => i);
    }

    // แปลง indices เป็น photo_reference
    analyzedData.selectedPhotos = selectedPhotos.map((index) => photos[index]);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!analyzedData.thaiName) {
      analyzedData.thaiName = name;
    }
    
    if (!analyzedData.description) {
      analyzedData.description = `สถานที่ท่องเที่ยวในอำเภอ${district} จังหวัดบุรีรัมย์`;
    }
    
    if (!analyzedData.category) {
      analyzedData.category = "Spots";
    }
    
    // ตรวจสอบ price level - ให้ AI ส่งช่วงราคาจริง
    let finalPrice = analyzedData.price;
    
    // ถ้า AI ส่งมาเป็นตัวเลข ให้แปลงเป็นช่วงราคา
    if (typeof finalPrice === 'number' || (typeof finalPrice === 'string' && /^\d+$/.test(finalPrice.trim()))) {
      const priceLevel = parseInt(finalPrice);
      switch (priceLevel) {
        case 0:
          finalPrice = "ฟรี";
          break;
        case 1:
          finalPrice = "10-100 บาท";
          break;
        case 2:
          finalPrice = "101-300 บาท";
          break;
        case 3:
          finalPrice = "300+ บาท";
          break;
        default:
          finalPrice = "ไม่ระบุราคา";
      }
    }
    
    // ถ้า AI ไม่ส่งราคามา หรือส่งมาผิดรูปแบบ ให้ประเมินจากข้อมูลอื่น
    if (!finalPrice || finalPrice === "ไม่ระบุราคา") {
      if (price_level !== undefined && price_level >= 0 && price_level <= 3) {
        switch (price_level) {
          case 0:
            finalPrice = "ฟรี";
            break;
          case 1:
            finalPrice = "10-100 บาท";
            break;
          case 2:
            finalPrice = "101-300 บาท";
            break;
          case 3:
            finalPrice = "300+ บาท";
            break;
        }
      } else {
        // ประเมินตามชื่อและประเภท
        const nameAndAddress = (name + ' ' + address).toLowerCase();
        if (nameAndAddress.includes('วัด') || nameAndAddress.includes('temple') || 
            nameAndAddress.includes('สวนสาธารณะ') || nameAndAddress.includes('park')) {
          finalPrice = "ฟรี";
        } else if (nameAndAddress.includes('ตลาด') || nameAndAddress.includes('market')) {
          finalPrice = "10-100 บาท";
        } else {
          finalPrice = "101-300 บาท"; // ปานกลาง (default)
        }
      }
    }
    
    analyzedData.price = finalPrice;

    // เพิ่ม district เข้าไปในข้อมูลที่จะส่งกลับ
    analyzedData.district = district;

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