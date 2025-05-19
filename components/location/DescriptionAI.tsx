"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Clock, AlertCircle } from "lucide-react";

interface DescriptionAIProps {
  locationName: string;
  locationDescription: string;
  locationDistrict: string;
}

export default function DescriptionAI({ locationName, locationDescription, locationDistrict }: DescriptionAIProps) {
  const [aiDescription, setAiDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateDescription = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!generatedText) {
          throw new Error("ไม่พบเนื้อหาในการตอบกลับ");
        }
        
        setAiDescription(generatedText);
      } catch (error) {
        console.error("Error generating description:", error);
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
        setAiDescription("");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateDescription();
  }, [locationName, locationDescription, locationDistrict]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-teal-500" />
        <h2 className="text-2xl font-bold text-gray-800">
          รายละเอียดเพิ่มเติม AI
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-center">
            กำลังสร้างคำอธิบายเพิ่มเติม...
            <br />
            <span className="text-sm text-gray-500">โปรดรอสักครู่</span>
          </p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-700 font-medium">ไม่สามารถสร้างคำอธิบายได้</p>
          </div>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 transition font-medium"
            onClick={() => window.location.reload()}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none bg-gradient-to-b from-white to-blue-50 rounded-lg p-5">
          <ReactMarkdown>{aiDescription}</ReactMarkdown>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="mt-4 text-xs text-gray-500 italic text-right">
          สร้างโดย Gemini AI • อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </div>
      )}
    </div>
  );
}