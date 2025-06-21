import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { 
    weather, 
    timeOfDay, 
    selectedCity,
    promptKey 
  } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "❌ API Key is missing" }, { status: 500 });
  }

  try {
    // ข้อมูลสถานที่ท่องเที่ยวตามอำเภอ
    const districtAttractions = {
      "Buriram": ["ปราสาทหินพนมรุ้ง", "ปราสาทเมืองต่ำ", "สนามฟุตบอลช้าง อารีนา", "สนามแข่งรถช้าง เซอร์กิต"],
      "Nang Rong": ["วัดเขาพระอังคาร", "อ่างเก็บน้ำห้วยตลาด", "ตลาดย้อนยุคนางรอง"],
      "Prakhon Chai": ["ปราสาทหินพนมรุ้ง", "ปราสาทเมืองต่ำ", "อุทยานแห่งชาติตาพระยา"],
      "Lam Plai Mat": ["วนอุทยานภูเขาไฟกระโดง", "หมู่บ้านทอผ้าไหม"],
      "Satuek": ["น้ำตกตาดโนนพระ", "เขื่อนลำนางรอง", "หมู่บ้านปั้นหม้อเตาโอ่ง"]
    };

    // ข้อมูลอาหารท้องถิ่น
    const localFood = {
      "Buriram": ["ข้าวหอมมะลิทุ่งกุลาร้องไห้", "กระยาสารท", "ข้าวเหนียวหลาม"],
      "Nang Rong": ["หมี่กรอบนางรอง", "ส้มตำไทย", "ไก่ย่างเขาพระอังคาร"],
      "Prakhon Chai": ["ปลาส้มฟัก", "แกงไก่ใบมะขามอ่อน", "ต้มปลาคัง"],
      "Lam Plai Mat": ["ข้าวหอมมะลิ", "แกงเห็ด", "ปลาร้าบอง"],
      "Satuek": ["ส้มตำปูปลาร้า", "แกงป่าปลาคัง", "หมกปลา"]
    };

    // ข้อมูลเทศกาลท้องถิ่น
    const localFestivals = {
      "1": ["เทศกาลตรุษจีน", "งานวันเด็กแห่งชาติ"],
      "2": ["เทศกาลขึ้นเขาพนมรุ้ง", "เทศกาลวาเลนไทน์"],
      "3": ["สงกรานต์บุรีรัมย์", "งานแสดงศิลปวัฒนธรรมอีสาน"],
      "4": ["ประเพณีบุญบั้งไฟ", "เทศกาลดอกลำดวนบาน"],
      "5": ["ประเพณีบุญบั้งไฟ", "วิสาขบูชา"],
      "6": ["เทศกาลมหาสงกรานต์", "บุญประเพณีแห่เทียนพรรษา"],
      "7": ["งานแสดงช้างและมวยช้าง", "งานวันอาสาฬหบูชา"],
      "8": ["งานเทศกาลกินเจ", "งานวันแม่แห่งชาติ"],
      "9": ["เทศกาลกินเจ", "ประเพณีสารทไทย"],
      "10": ["เทศกาลแข่งเรือยาว", "ประเพณีออกพรรษา"],
      "11": ["งานแข่งรถที่สนามช้าง อินเตอร์เนชั่นแนล เซอร์กิต", "ประเพณีลอยกระทง"],
      "12": ["เทศกาลท่องเที่ยวปราสาทหินและงานกาชาด", "เทศกาลส่งท้ายปีเก่าต้อนรับปีใหม่"]
    };

    const { weather: weatherDetails, main: mainData, name } = weather;
    const { description, main: weatherMain } = weatherDetails[0];
    const { temp, humidity } = mainData;
    const currentMonth = new Date().getMonth() + 1;

    const attractions = districtAttractions[selectedCity as keyof typeof districtAttractions] || districtAttractions["Buriram"];
    const foods = localFood[selectedCity as keyof typeof localFood] || localFood["Buriram"];
    const festivals = localFestivals[currentMonth.toString() as keyof typeof localFestivals] || [];

    let customPrompt = "";
    if (promptKey) {
      switch (promptKey) {
        case "attraction":
          customPrompt = `แนะนำสถานที่ท่องเที่ยวที่น่าสนใจในอำเภอ ${selectedCity} จังหวัดบุรีรัมย์ พร้อมเหตุผลและเกร็ดความรู้ท้องถิ่น`; break;
        case "food":
          customPrompt = `แนะนำอาหารท้องถิ่นขึ้นชื่อในอำเภอ ${selectedCity} จังหวัดบุรีรัมย์ พร้อมบอกจุดเด่นและร้านแนะนำ`; break;
        case "festival":
          customPrompt = `มีเทศกาลหรือกิจกรรมอะไรน่าสนใจในเดือนนี้ที่บุรีรัมย์บ้าง ช่วยเล่าให้ฟังหน่อย`; break;
        case "culture":
          customPrompt = `เล่าเรื่องประวัติศาสตร์หรือวัฒนธรรมที่น่าสนใจของบุรีรัมย์ให้ฟังหน่อย`; break;
        case "accommodation":
          customPrompt = `แนะนำที่พักหรือร้านอาหารบรรยากาศดีในอำเภอ ${selectedCity} จังหวัดบุรีรัมย์`; break;
        default:
          customPrompt = `ช่วยแนะนำการท่องเที่ยวในบุรีรัมย์หน่อย`; break;
      }
    }

    const prompt = `
      คุณคือผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์ที่เป็นกันเอง มีความรู้เกี่ยวกับประวัติศาสตร์ วัฒนธรรม อาหาร และสถานที่ท่องเที่ยวในบุรีรัมย์เป็นอย่างดี
      ชื่อของคุณคือ "น้องบุรี" ชอบแนะนำสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์และใช้ภาษาที่เป็นกันเอง สนิทสนม  
      ใส่สำนวนท้องถิ่นเล็กน้อยแต่ไม่มากเกินไป และใช้ภาษาที่เข้าใจง่ายสำหรับคนไทย

      ข้อมูลปัจจุบัน:
      - สถานที่: ${name} (อำเภอ ${selectedCity})
      - สภาพอากาศ: ${description} (${weatherMain})
      - อุณหภูมิ: ${temp}°C
      - ความชื้น: ${humidity}%
      - ช่วงเวลา: ${timeOfDay}
      ${customPrompt ? `- หัวข้อที่ผู้ใช้เลือก: ${customPrompt}` : ''}

      ตอบในรูปแบบสนทนา เป็นกันเอง ใส่ emoji เล็กน้อย ใช้ภาษาสั้นกระชับและมีสำนวนท้องถิ่น
      ความยาว 2-3 ย่อหน้า
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
            maxOutputTokens: 800,
          }
        }),
      }
    );

    const data = await response.json();
    
    let suggestion = "ไม่สามารถดึงข้อมูลคำแนะนำได้ กรุณาลองใหม่";

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      suggestion = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("❌ Error fetching Gemini API:", error);
    return NextResponse.json({
      suggestion: "เกิดข้อผิดพลาดในการติดต่อ AI"
    }, { status: 200 });
  }
} 