"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface LocationChatBotProps {
  locationName: string;
  locationDescription: string;
  locationDistrict: string;
}

export default function LocationChatBot({ locationName, locationDescription, locationDistrict }: LocationChatBotProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
    {
      text: `สวัสดีค่ะ! 🌟 ยินดีต้อนรับสู่ ${locationName} ฉันพร้อมให้ข้อมูลและคำแนะนำเกี่ยวกับสถานที่แห่งนี้ มีอะไรอยากรู้เพิ่มเติมไหมคะ?`,
      sender: "bot"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setIsLoading(true);

    try {
      const prompt = `
        คุณคือผู้ให้คำแนะนำด้านการท่องเที่ยวบุรีรัมย์ที่เป็นกันเอง มีความรู้เกี่ยวกับประวัติศาสตร์ วัฒนธรรม อาหาร และสถานที่ท่องเที่ยวในบุรีรัมย์เป็นอย่างดี
        ชื่อของคุณคือ "น้องบุรี" ชอบแนะนำสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์และใช้ภาษาที่เป็นกันเอง สนิทสนม มีเอกลักษณ์ของคนอีสาน

        ข้อมูลสถานที่:
        - ชื่อสถานที่: ${locationName}
        - คำอธิบาย: ${locationDescription}
        - อำเภอ: ${locationDistrict}

        คำถามจากผู้ใช้: ${userMessage}

        กรุณาให้คำแนะนำในรูปแบบการสนทนา ทักทายด้วยความเป็นกันเอง ใช้ภาษาสั้นกระชับ เป็นธรรมชาติ 
        ใส่เอกลักษณ์ของคนอีสานเล็กน้อย (เช่น คำลงท้าย "เด้อ" "นะคะ" หรือสำนวนท้องถิ่น) 
        ตอบเหมือนกำลังคุยกับนักท่องเที่ยวจริงๆ แนะนำจุดเด่นของสถานที่ท่องเที่ยวและข้อมูลที่น่าสนใจ
        และสอดแทรกความรู้เกี่ยวกับวัฒนธรรมหรือเกร็ดความรู้ท้องถิ่นที่น่าสนใจ

        ความยาวประมาณ 2-3 ย่อหน้า ใช้ emoji ประกอบเล็กน้อยเพื่อความน่าสนใจ แต่ไม่มากเกินไป
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

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "ขออภัยค่ะ ไม่สามารถให้คำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ";

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อ AI กรุณาลองใหม่อีกครั้งนะคะ", 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating button to toggle chat */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
          isChatOpen
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        }`}
        aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
      >
        {isChatOpen ? (
          <X size={24} className="animate-spin-once" />
        ) : (
          <MessageSquare size={24} />
        )}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-0 rounded-full mr-3 w-10 h-10 flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="/images/avatars/default-avatar.png"
                  alt="บอทบุรีรัมย์"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  น้องบุรี
                </h1>
                <p className="text-blue-100 text-xs">ผู้ให้คำแนะนำด้านการท่องเที่ยว</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-100 p-3 shadow-md">
                  <div className="flex items-center">
                    <div className="animate-bounce flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
                    </div>
                    <span className="ml-2">กำลังคิดคำตอบ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="ถามเกี่ยวกับสถานที่นี้..."
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-500 placeholder-gray-500 border"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 rounded-r-lg transition ${
                  isLoading || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 