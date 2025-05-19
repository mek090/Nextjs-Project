"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface DescriptionAIProps {
  locationName: string;
  locationDescription: string;
  locationDistrict: string;
}

export default function DescriptionAI({ locationName, locationDescription, locationDistrict }: DescriptionAIProps) {
  const [aiDescription, setAiDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateDescription = async () => {
      try {
        const prompt = `
          คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวและประวัติศาสตร์ของจังหวัดบุรีรัมย์
          กรุณาให้ข้อมูลเพิ่มเติมเกี่ยวกับสถานที่ท่องเที่ยวต่อไปนี้:

          ชื่อสถานที่: ${locationName}
          คำอธิบายพื้นฐาน: ${locationDescription}
          อำเภอ: ${locationDistrict}

          กรุณาให้ข้อมูลในหัวข้อต่อไปนี้:
          1. ประวัติความเป็นมาและความสำคัญของสถานที่
          2. สถาปัตยกรรมและจุดเด่นที่น่าสนใจ
          3. กิจกรรมที่สามารถทำได้
          4. วัฒนธรรมและประเพณีที่เกี่ยวข้อง
          5. ข้อแนะนำในการเที่ยวชม
          6. เกร็ดความรู้ที่น่าสนใจ

          ใช้ภาษาที่เข้าใจง่าย สนุกสนาน และน่าสนใจ ใส่ emoji ประกอบเล็กน้อยเพื่อความน่าสนใจ
          ความยาวประมาณ 4-5 ย่อหน้า
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
                maxOutputTokens: 1000,
              }
            }),
          }
        );

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "ขออภัย ไม่สามารถสร้างคำอธิบายได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";

        setAiDescription(generatedText);
      } catch (error) {
        console.error("Error generating description:", error);
        setAiDescription("ขออภัย เกิดข้อผิดพลาดในการสร้างคำอธิบาย กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    };

    generateDescription();
  }, [locationName, locationDescription, locationDistrict]);

  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-bounce flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
          </div>
          <span className="text-gray-600">กำลังสร้างคำอธิบายเพิ่มเติม...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        รายละเอียดเพิ่มเติม
      </h2>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{aiDescription}</ReactMarkdown>
      </div>
    </div>
  );
} 