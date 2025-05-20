"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import Link from "next/link";


// Define types for weather data
type WeatherCondition = {
  description: string;
  main: string;
}

type MainWeatherData = {
  temp: number;
  humidity: number;
}

type WeatherData = {
  weather: WeatherCondition[];
  main: MainWeatherData;
  name: string;
}

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export default function Bot({
  weather,
  timeOfDay,
  selectedCity
}: {
  weather: WeatherData | null;
  timeOfDay: string;
  selectedCity: string;
}) {
  const [suggestion, setSuggestion] = useState<string>("⏳ กำลังโหลดคำแนะนำ...");
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarMood, setAvatarMood] = useState<string>("neutral");
  const [currentTime, setCurrentTime] = useState<string>('');

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

  useEffect(() => {
    if (weather) {
      console.log("Weather object:", weather);
      generateSuggestion();
    }
    
  }, [weather, selectedCity, timeOfDay]);

  // กำหนด mood ของ avatar ตามสภาพอากาศ
  useEffect(() => {
    if (weather) {
      const weatherMain = weather.weather[0].main;
      const temp = weather.main.temp;

      if (weatherMain === "Clear") {
        setAvatarMood("happy");
      } else if (weatherMain === "Rain" || weatherMain === "Thunderstorm") {
        setAvatarMood("sad");
      } else if (temp > 35) {
        setAvatarMood("hot");
      } else if (temp < 20) {
        setAvatarMood("cold");
      } else {
        setAvatarMood("neutral");
      }
    }
  }, [weather]);

  // ดึงเวลาปัจจุบันจากเบราว์เซอร์ (Timezone: Asia/Bangkok)
  const getBrowserTime = (): { currentDate: Date; localTime: string; currentMonth: number } => {
    const currentDate = new Date();
    const localTime = currentDate.toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour12: false,
    });
    const currentMonth = currentDate.getMonth() + 1; // เดือนเริ่มจาก 0
    console.log("Browser current time (Asia/Bangkok):", localTime);
    return { currentDate, localTime, currentMonth };
  };

  const generateSuggestion = async (): Promise<void> => {
    if (!weather) return;

    setLoading(true);
    try {
      // ดึงข้อมูลสภาพอากาศจาก API
      const { weather: weatherDetails, main: mainData, name } = weather;
      const { description, main: weatherMain } = weatherDetails[0];
      const { temp, humidity } = mainData;

      // ใช้เวลาจากเบราว์เซอร์แทนค่า dt
      const { localTime, currentMonth } = getBrowserTime();

      // ดึงข้อมูลสถานที่ท่องเที่ยวของอำเภอที่เลือก
      const attractions = districtAttractions[selectedCity as keyof typeof districtAttractions] || districtAttractions["Buriram"];

      // ดึงข้อมูลอาหารท้องถิ่นของอำเภอที่เลือก
      const foods = localFood[selectedCity as keyof typeof localFood] || localFood["Buriram"];

      // ดึงข้อมูลเทศกาลในเดือนปัจจุบัน
      const festivals = localFestivals[currentMonth.toString() as keyof typeof localFestivals] || [];

      console.log("generateSuggestion:", { localTime, timeOfDay, selectedCity, attractions, foods });

      // สร้างคำแนะนำที่เหมาะสมตามสภาพอากาศ
      let weatherAdvice = "";

      if (weatherMain === "Clear" && timeOfDay === "กลางวัน") {
        weatherAdvice = "วันนี้แดดค่อนข้างแรงนะคะ แนะนำให้พกร่ม หมวก หรือทาครีมกันแดดเวลาออกไปเที่ยวกลางแจ้ง และดื่มน้ำเยอะๆ ค่ะ";
      } else if (weatherMain === "Rain") {
        weatherAdvice = "วันนี้ฝนตกนะคะ ควรพกร่มหรือเสื้อกันฝนไปด้วย และระวังถนนลื่น อาจเลือกเที่ยวสถานที่ในร่มแทนค่ะ";
      } else if (weatherMain === "Clouds" && timeOfDay === "กลางวัน") {
        weatherAdvice = "วันนี้อากาศดีมีเมฆบางส่วน เหมาะแก่การออกไปเที่ยวกลางแจ้งค่ะ";
      } else if (timeOfDay === "กลางคืน") {
        weatherAdvice = "ช่วงกลางคืน อุณหภูมิอาจลดลงเล็กน้อย แนะนำให้เตรียมเสื้อคลุมบางๆ ไปด้วยค่ะ";
      }

      // สร้างคำแนะนำสถานที่ท่องเที่ยวตามช่วงเวลา
      let attractionAdvice = "";

      if (timeOfDay === "กลางวัน") {
        // สุ่มเลือกสถานที่ท่องเที่ยว 2 แห่งจากรายการ
        const randomAttractions = attractions.sort(() => 0.5 - Math.random()).slice(0, 2);
        attractionAdvice = `ในช่วงกลางวันแบบนี้ แนะนำให้ไปเที่ยวที่ ${randomAttractions.join(" หรือ ")} ค่ะ`;
      } else {
        // แนะนำสถานที่ท่องเที่ยวหรือกิจกรรมยามค่ำคืน
        attractionAdvice = "สำหรับช่วงค่ำคืน แนะนำให้ไปเดินเล่นที่ถนนคนเดิน ชมแสงสีในตัวเมือง หรือนั่งรับประทานอาหารเย็นที่ร้านอาหารท้องถิ่นบรรยากาศดีๆ ค่ะ";
      }

      // สร้างคำแนะนำอาหารท้องถิ่น
      // สุ่มเลือกอาหารท้องถิ่น 2 รายการ
      const randomFoods = foods.sort(() => 0.5 - Math.random()).slice(0, 2);
      const foodAdvice = `อาหารท้องถิ่นที่ขอแนะนำให้ลองชิมคือ ${randomFoods.join(" และ ")} ซึ่งเป็นเมนูขึ้นชื่อของที่นี่เลยค่ะ`;

      // สร้างคำแนะนำเทศกาลหรืองานประเพณี (ถ้ามี)
      let festivalAdvice = "";
      if (festivals.length > 0) {
        festivalAdvice = `และในเดือนนี้มีเทศกาลน่าสนใจคือ ${festivals.join(" และ ")} อย่าพลาดนะคะ`;
      }

      // ปรับ prompt ให้มีเงื่อนไขตามช่วงเวลาจริงและเฉพาะเจาะจงกับข้อมูลท้องถิ่น
      const prompt = `
        คุณคือผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์ที่เป็นกันเอง มีความรู้เกี่ยวกับประวัติศาสตร์ วัฒนธรรม อาหาร และสถานที่ท่องเที่ยวในบุรีรัมย์เป็นอย่างดี 
        ชื่อของคุณคือ "น้องบุรี" ชอบแนะนำสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์และใช้ภาษาที่เป็นกันเอง สนิทสนม  
        ใส่สำนวนท้องถิ่นเล็กน้อยแต่ไม่มากเกินไป และใช้ภาษาที่เข้าใจง่ายสำหรับคนไทย

        ข้อมูลปัจจุบัน:
        - สถานที่: ${name} (อำเภอ ${selectedCity})
        - สภาพอากาศ: ${description} (${weatherMain})
        - อุณหภูมิ: ${temp}°C
        - ความชื้น: ${humidity}%
        - เวลาปัจจุบัน: ${localTime} (เวลาท้องถิ่น)
        - ช่วงเวลา: ${timeOfDay}
        
        คำแนะนำพื้นฐาน:
        - คำแนะนำตามสภาพอากาศ: ${weatherAdvice}
        - คำแนะนำสถานที่ท่องเที่ยว: ${attractionAdvice}
        - คำแนะนำอาหารท้องถิ่น: ${foodAdvice}
        ${festivalAdvice ? `- คำแนะนำเทศกาล: ${festivalAdvice}` : ''}

        กรุณาให้คำแนะนำในรูปแบบการสนทนา ทักทายด้วยความเป็นกันเอง ใช้ภาษาสั้นกระชับ เป็นธรรมชาติ 
        ใส่เอกลักษณ์ของคนอีสานเล็กน้อย (เช่น คำลงท้าย "เด้อ" "นะคะ" หรือสำนวนท้องถิ่น) 
        ตอบเหมือนกำลังคุยกับนักท่องเที่ยวจริงๆ แนะนำจุดเด่นของสถานที่ท่องเที่ยวและอาหารที่น่าสนใจ 
        หากสภาพอากาศไม่ดี ให้คำแนะนำทางเลือกในการท่องเที่ยวที่เหมาะสม 
        และสอดแทรกความรู้เกี่ยวกับวัฒนธรรมหรือเกร็ดความรู้ท้องถิ่นที่น่าสนใจ

        ความยาวประมาณ 3-4 ย่อหน้า ใช้ emoji ประกอบเล็กน้อยเพื่อความน่าสนใจ แต่ไม่มากเกินไป
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
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

      const data: GeminiResponse = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "ไม่สามารถดึงข้อมูลคำแนะนำได้ กรุณาลองใหม่";
      setSuggestion(generatedText);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setSuggestion("เกิดข้อผิดพลาดในการติดต่อ AI");
    }
    setLoading(false);
  };

  // เลือก avatar ตาม mood และเวลา
  const getAvatarImage = () => {
    const baseUrl = "/images/default-avatar2.png/";

    // ขึ้นอยู่กับ timeOfDay และ avatarMood
    if (timeOfDay === "กลางคืน") {
      return `${baseUrl}night-${avatarMood}.png`;
    } else {
      return `${baseUrl}day-${avatarMood}.png`;
    }
  };

  useEffect(() => {
    // Update time only on client side
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-300 dark:border-gray-700 h-full">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400">
          <img
            src={getAvatarImage()}
            alt="น้องบุรี"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/avatars/default-avatar2.png";
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            น้องบุรี
            <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">BOT Support</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">ผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์</p>
        </div>
        {/* 
        <Button
          size="lg"
          className="ml-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:translate-x-2 transition-all duration-300"
          asChild
        >
          <Link href='/chat' className="flex items-center space-x-1">
            <span>ไปที่แชท</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </Button> */}
      </div>

      <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {currentTime}
          </span>
          <span className="mx-2">•</span>
          {timeOfDay === "กลางวัน" ? "☀️ กลางวัน" : "🌙 กลางคืน"}
        </div>

        <div className="chat-bubble relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="animate-bounce flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">กำลังคิดคำแนะนำ...</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{suggestion}</ReactMarkdown>
            </div>
          )}

          {/* ลูกศรชี้จาก avatar ไปยัง chat bubble */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-r-8 border-b-8 border-white dark:border-gray-800 border-transparent border-r-white dark:border-r-gray-800"></div>
        </div>
      </div>

      {/* ส่วนแสดงข้อมูลเพิ่มเติม */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">แหล่งข้อมูลเพิ่มเติม</h3>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://www.buriram.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-center text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition"
          >
            เว็บไซต์จังหวัด
          </a>
          <a
            href="tel:044666666"
            className="bg-green-50 dark:bg-green-900/30 p-2 rounded text-center text-green-600 dark:text-green-300 hover:bg-green-100 transition"
          >
            ศูนย์บริการนักท่องเที่ยว
          </a>
        </div>
      </div>
    </div>
  );
}