"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SignInButton, useAuth } from "@clerk/nextjs";

interface LocationChatBotProps {
  locationName: string;
  locationDescription: string;
  locationDistrict: string;
}

export default function LocationChatBot({ locationName, locationDescription, locationDistrict }: LocationChatBotProps) {
  const { userId } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
    {
      text: `สวัสดีค่ะ! 🌟 ยินดีต้อนรับสู่ ${locationName} ฉันพร้อมให้ข้อมูลและคำแนะนำเกี่ยวกับสถานที่แห่งนี้ มีอะไรอยากรู้เพิ่มเติมไหมคะ?`,
      sender: "bot"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleSuggestions = (): void => {
    setShowSuggestions(!showSuggestions);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/location-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          locationName,
          locationDescription,
          locationDistrict
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botResponse = data.reply || 
        "ขออภัยค่ะ ไม่สามารถให้คำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ";

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อระบบ กรุณาลองใหม่อีกครั้งนะคะ 🙏", 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!userId) {
    return (
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
        <SignInButton mode="modal">
          <button
            className={`p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
              isChatOpen
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            }`}
            aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
          >
            {isChatOpen ? (
              <X size={20} className="sm:w-6 sm:h-6 animate-spin-once" />
            ) : (
              <MessageSquare size={20} className="sm:w-6 sm:h-6" />
            )}
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
      {/* Floating button to toggle chat */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
          isChatOpen
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        }`}
        aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
      >
        {isChatOpen ? (
          <X size={20} className="sm:w-6 sm:h-6 animate-spin-once" />
        ) : (
          <MessageSquare size={20} className="sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-0 rounded-full mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="/images/avatars/default-avatar.png"
                  alt="บอทบุรีรัมย์"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234F46E5'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  น้องบุรี
                </h1>
                <p className="text-blue-100 text-xs">ผู้ช่วยด้านการท่องเที่ยวบุรีรัมย์</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 shadow-md ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-100 p-2.5 sm:p-3 shadow-md">
                  <div className="flex items-center">
                    <div className="animate-bounce flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="ml-2 text-xs sm:text-sm">กำลังคิดคำตอบ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ถามเกี่ยวกับสถานที่นี้..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-l-lg focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-500 placeholder-gray-500 border text-xs sm:text-sm"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-r-lg transition ${
                  isLoading || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                aria-label="ส่งข้อความ"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
            <div className="text-xs text-gray-500 mt-1">
              {/* กด Enter เพื่อส่งข้อความ */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}