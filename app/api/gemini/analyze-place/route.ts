import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { 
    locationName, 
    locationDescription, 
    locationDistrict, 
    locationCategory,
    locationLat,
    locationLng 
  } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "❌ API Key is missing" }, { status: 500 });
  }

  try {
    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวและประวัติศาสตร์ของจังหวัดบุรีรัมย์ ประเทศไทย
      
      กรุณาให้ข้อมูลเกี่ยวกับสถานที่ท่องเที่ยวต่อไปนี้อย่างละเอียดและครบถ้วน:
      ชื่อสถานที่: ${locationName}
      คำอธิบายพื้นฐาน: ${locationDescription}
      อำเภอ: ${locationDistrict}
      ประเภท: ${locationCategory}
      พิกัด: ${locationLat}, ${locationLng}
      
      กรุณาใช้โครงสร้าง Markdown และแบ่งข้อมูลเป็นหัวข้อดังนี้:
      
      ## 📜 ประวัติและความสำคัญ
      - อธิบายประวัติความเป็นมาของสถานที่อย่างน่าสนใจ
      - ความสำคัญทางประวัติศาสตร์ วัฒนธรรม หรือธรรมชาติ
      - เรื่องราวและตำนานที่เกี่ยวข้อง
      
      ## 🌟 จุดเด่นที่ไม่ควรพลาด
      - สถาปัตยกรรมและสิ่งก่อสร้างที่โดดเด่น
      - ทัศนียภาพและจุดถ่ายรูปที่สวยงาม
      - สิ่งที่ทำให้สถานที่นี้มีเอกลักษณ์เฉพาะตัว
      
      ## 🎯 กิจกรรมแนะนำ
      - กิจกรรมที่นักท่องเที่ยวสามารถทำได้
      - กีฬาหรือกิจกรรมนันทนาการในพื้นที่
      - กิจกรรมตามฤดูกาลหรือเทศกาล
      
      ## 🗓️ ช่วงเวลาที่เหมาะสมในการเยี่ยมชม
      - ฤดูกาลที่ดีที่สุดในการเยี่ยมชม
      - วันและเวลาทำการ
      - ช่วงเวลาที่มีกิจกรรมพิเศษหรือเทศกาล
      
      ## 💡 ข้อแนะนำและเคล็ดลับ
      - คำแนะนำสำหรับการเตรียมตัว
      - สิ่งที่ควรและไม่ควรทำ
      - เคล็ดลับจากคนท้องถิ่น
      
      ## 🍽️ อาหารและของฝาก
      - อาหารพื้นเมืองหรืออาหารท้องถิ่นที่ควรลิ้มลอง
      - ร้านอาหารที่แนะนำในบริเวณใกล้เคียง
      - ของฝากหรือผลิตภัณฑ์ท้องถิ่นที่มีชื่อเสียง
      
      ## 🚗 การเดินทาง
      - วิธีการเดินทางไปยังสถานที่
      - การเดินทางภายในพื้นที่
      - ที่จอดรถและบริการขนส่งสาธารณะ
      
      ## 📱 ข้อมูลติดต่อและอื่นๆ
      - หมายเลขโทรศัพท์ (ถ้ามี)
      - เว็บไซต์หรือโซเชียลมีเดีย (ถ้ามี)
      - ค่าธรรมเนียมการเข้าชม (ถ้ามี)
      
      ใส่เกร็ดความรู้และข้อมูลที่น่าสนใจที่ไม่ค่อยมีคนรู้เกี่ยวกับสถานที่นี้
      ใส่ emoji ประกอบแต่ละย่อหน้าเพื่อความน่าสนใจ แต่ไม่มากเกินไป
      พยายามให้ข้อมูลเฉพาะเจาะจงเกี่ยวกับสถานที่นี้ในจังหวัดบุรีรัมย์ ไม่ใช่ข้อมูลทั่วไป
      หากไม่มีข้อมูลในหัวข้อใด ให้เขียนวิธีค้นหาข้อมูลเพิ่มเติมแทน
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
            topK: 40,
            topP: 0.95
          }
        }),
      }
    );

    const data = await response.json();
    
    let description = "";

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      description = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error("❌ Error fetching Gemini API:", error);
    return NextResponse.json({
      description: "ไม่สามารถรวบรวมข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"
    }, { status: 200 });
  }
}