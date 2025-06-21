"use client";

import React, { useEffect, useState } from "react";
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

  // เพิ่มรายการ prompt suggestion
  const promptSuggestions = [
    { label: "สถานที่ท่องเที่ยวแนะนำ", key: "attraction" },
    { label: "อาหารท้องถิ่น", key: "food" },
    { label: "เทศกาล/กิจกรรม", key: "festival" },
    { label: "ประวัติศาสตร์/วัฒนธรรม", key: "culture" },
    { label: "ที่พัก/ร้านอาหาร", key: "accommodation" },
  ];
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

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

      const response = await fetch('/api/gemini/travel-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather,
          timeOfDay,
          selectedCity,
          promptKey: selectedPrompt
        }),
      });

      const data = await response.json();
      const generatedText = data.suggestion || "ไม่สามารถดึงข้อมูลคำแนะนำได้ กรุณาลองใหม่";
      setSuggestion(generatedText);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setSuggestion("เกิดข้อผิดพลาดในการติดต่อ AI");
    }
    setLoading(false);
  };

  // ฟังก์ชันสร้าง prompt ตามหัวข้อที่เลือก
  const generateCustomSuggestion = async (promptKey: string) => {
    if (!weather) return;
    setLoading(true);
    setSelectedPrompt(promptKey);
    try {
      const { weather: weatherDetails, main: mainData, name } = weather;
      const { description, main: weatherMain } = weatherDetails[0];
      const { temp, humidity } = mainData;
      const { localTime, currentMonth } = getBrowserTime();
      const attractions = districtAttractions[selectedCity as keyof typeof districtAttractions] || districtAttractions["Buriram"];
      const foods = localFood[selectedCity as keyof typeof localFood] || localFood["Buriram"];
      const festivals = localFestivals[currentMonth.toString() as keyof typeof localFestivals] || [];

      // กำหนด prompt เฉพาะตามหัวข้อ
      let customPrompt = "";
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

      const prompt = `
        คุณคือผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์ที่เป็นกันเอง มีความรู้เกี่ยวกับประวัติศาสตร์ วัฒนธรรม อาหาร และสถานที่ท่องเที่ยวในบุรีรัมย์เป็นอย่างดี\nชื่อของคุณคือ \"น้องบุรี\" ชอบแนะนำสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์และใช้ภาษาที่เป็นกันเอง สนิทสนม\nใส่สำนวนท้องถิ่นเล็กน้อยแต่ไม่มากเกินไป และใช้ภาษาที่เข้าใจง่ายสำหรับคนไทย\n\nข้อมูลปัจจุบัน:\n- สถานที่: ${name} (อำเภอ ${selectedCity})\n- สภาพอากาศ: ${description} (${weatherMain})\n- อุณหภูมิ: ${temp}°C\n- ความชื้น: ${humidity}%\n- เวลาปัจจุบัน: ${localTime} (เวลาท้องถิ่น)\n- ช่วงเวลา: ${timeOfDay}\n\nหัวข้อที่ผู้ใช้เลือก: ${customPrompt}\n\nตอบในรูปแบบสนทนา เป็นกันเอง ใส่ emoji เล็กน้อย ใช้ภาษาสั้นกระชับและมีสำนวนท้องถิ่น\nความยาว 2-3 ย่อหน้า`;

      const response = await fetch('/api/gemini/travel-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather,
          timeOfDay,
          selectedCity,
          promptKey: selectedPrompt
        }),
      });
      const data = await response.json();
      const generatedText = data.suggestion || "ไม่สามารถดึงข้อมูลคำแนะนำได้ กรุณาลองใหม่";
      setSuggestion(generatedText);
    } catch (error) {
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
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-300 dark:border-gray-700 h-full">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 bg-blue-100 dark:bg-blue-900 border-2 border-blue-400">
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
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center flex-wrap gap-2">
            น้องบุรี
            <span className="text-xs sm:text-sm bg-green-500 text-white px-2 py-1 rounded-full">
              BOT Support
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            ผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {currentTime}
          </span>
          <span className="mx-2">•</span>
          {timeOfDay === "กลางวัน" ? "☀️ กลางวัน" : "🌙 กลางคืน"}
        </div>
      </div>

      {/* เพิ่มปุ่ม prompt suggestion ให้ผู้ใช้เลือกสอบถามเพิ่มเติม */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
            เลือกสอบถามเพิ่มเติม
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {promptSuggestions.map((item) => (
            <Button
              key={item.key}
              variant={selectedPrompt === item.key ? "secondary" : "outline"}
              size="sm"
              onClick={() => generateCustomSuggestion(item.key)}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 h-8 sm:h-9 transition-all duration-200 ${
                selectedPrompt === item.key 
                  ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105" 
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300"
              }`}
            >
              <span className="flex items-center gap-1 sm:gap-2">
                {item.key === "attraction" && "🏛️"}
                {item.key === "food" && "🍜"}
                {item.key === "festival" && "🎉"}
                {item.key === "culture" && "📚"}
                {item.key === "accommodation" && "🏨"}
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="chat-bubble relative bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow border border-gray-100 dark:border-gray-600">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="animate-bounce flex space-x-1 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center">
              กำลังคิดคำแนะนำ...
            </p>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
            <ReactMarkdown>{suggestion}</ReactMarkdown>
          </div>
        )}

        {/* ลูกศรชี้จาก avatar ไปยัง chat bubble */}
        <div className="absolute top-4 -left-2 w-0 h-0 border-t-6 sm:border-t-8 border-r-6 sm:border-r-8 border-b-6 sm:border-b-8 border-white dark:border-gray-800 border-transparent border-r-white dark:border-r-gray-800"></div>
      </div>

      {/* ส่วนแสดงข้อมูลเพิ่มเติม */}
      <div className="mt-4 sm:mt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">
          แหล่งข้อมูลเพิ่มเติม
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <a
            href="https://www.buriram.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 dark:bg-blue-900/30 p-3 sm:p-4 rounded-lg text-center text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 text-sm sm:text-base font-medium"
          >
            🌐 เว็บไซต์จังหวัด
          </a>
          <a
            href="tel:044666666"
            className="bg-green-50 dark:bg-green-900/30 p-3 sm:p-4 rounded-lg text-center text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200 text-sm sm:text-base font-medium"
          >
            📞 ศูนย์บริการนักท่องเที่ยว
          </a>
        </div>
      </div>
    </div>
  );
}