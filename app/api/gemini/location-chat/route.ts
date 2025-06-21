import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, locationName, locationDescription, locationDistrict } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "❌ API Key is missing" }, { status: 500 });
  }

  try {
    const prompt = `
คุณคือ "น้องบุรี" ผู้ช่วยให้คำแนะนำด้านการท่องเที่ยวในจังหวัดบุรีรัมย์ที่เป็นมิตรและมีความรู้ดี

บุคลิกภาพของคุณ:
- เป็นกันเอง อัธยาศัยดี และให้ข้อมูลที่ถูกต้อง
- ใช้ภาษาไทยกลางที่สุภาพ ไม่ใช้ภาษาถิ่น
- มีความรู้เกี่ยวกับประวัติศาสตร์ วัฒนธรรม อาหาร และสถานที่ท่องเที่ยวในบุรีรัมย์
- ตอบคำถามอย่างกระชับ เข้าใจง่าย
- ไม่ต้องทักทายซ้ำ เข้าประเด็นคำถามเลย

ข้อมูลสถานที่ปัจจุบัน:
- ชื่อสถานที่: ${locationName}
- คำอธิบาย: ${locationDescription}
- อำเภอ: ${locationDistrict}

คำถามจากผู้ใช้: ${message}

คำแนะนำในการตอบ:
1. ตอบคำถามตรงประเด็น ไม่ต้องทักทายซ้ำ
2. ให้ข้อมูลที่เป็นประโยชน์และน่าสนใจ
3. แนะนำจุดเด่นของสถานที่และกิจกรรมที่ทำได้
4. ใช้ emoji เล็กน้อยเพื่อความน่าสนใจ
5. **ตอบสั้นๆ กระชับ 1-2 ประโยค ไม่ต้องยาว**
6. ไม่ใช้คำภาษาถิ่นอีสาน ใช้ภาษาไทยกลางที่สุภาพ

ตอบด้วยน้ำเสียงเป็นมิตรและให้ความรู้สึกว่าคุณเป็นไกด์ท้องถิ่นที่รู้จักสถานที่ดี แต่ไม่ต้องทักทายซ้ำในทุกคำตอบ และตอบสั้นๆ กระชับ
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
            topP: 0.9,
            topK: 40,
          }
        }),
      }
    );

    const data = await response.json();
    
    let reply = "ขออภัยค่ะ ไม่สามารถให้คำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ";

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("❌ Error fetching Gemini API:", error);
    return NextResponse.json({
      reply: "ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อระบบ กรุณาลองใหม่อีกครั้งนะคะ 🙏"
    }, { status: 200 });
  }
} 