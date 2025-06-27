// "use client";

// import { useState, useEffect } from "react";
// import { MessageSquare, X } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { SignInButton, useAuth } from "@clerk/nextjs";

// interface LocationChatBotProps {
//   locationName: string;
//   locationDescription: string;
//   locationDistrict: string;
// }

// export default function LocationChatBot({ locationName, locationDescription, locationDistrict }: LocationChatBotProps) {
//   const { userId } = useAuth();
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
//     {
//       text: `สวัสดีค่ะ! 🌟 ยินดีต้อนรับสู่ ${locationName} ฉันพร้อมให้ข้อมูลและคำแนะนำเกี่ยวกับสถานที่แห่งนี้ มีอะไรอยากรู้เพิ่มเติมไหมคะ?`,
//       sender: "bot"
//     }
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const toggleSuggestions = (): void => {
//     setShowSuggestions(!showSuggestions);
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput("");
//     setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/gemini/location-chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: userMessage,
//           locationName,
//           locationDescription,
//           locationDistrict
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       const botResponse = data.reply || 
//         "ขออภัยค่ะ ไม่สามารถให้คำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ";

//       setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
//     } catch (error) {
//       console.error("Error:", error);
//       setMessages(prev => [...prev, { 
//         text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อระบบ กรุณาลองใหม่อีกครั้งนะคะ 🙏", 
//         sender: "bot" 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   if (!userId) {
//     return (
//       <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
//         <SignInButton mode="modal">
//           <button
//             className={`p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
//               isChatOpen
//                 ? "bg-red-500 text-white hover:bg-red-600"
//                 : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
//             }`}
//             aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
//           >
//             {isChatOpen ? (
//               <X size={20} className="sm:w-6 sm:h-6 animate-spin-once" />
//             ) : (
//               <MessageSquare size={20} className="sm:w-6 sm:h-6" />
//             )}
//           </button>
//         </SignInButton>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
//       {/* Floating button to toggle chat */}
//       <button
//         onClick={() => setIsChatOpen(!isChatOpen)}
//         className={`p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
//           isChatOpen
//             ? "bg-red-500 text-white hover:bg-red-600"
//             : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
//         }`}
//         aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
//       >
//         {isChatOpen ? (
//           <X size={20} className="sm:w-6 sm:h-6 animate-spin-once" />
//         ) : (
//           <MessageSquare size={20} className="sm:w-6 sm:h-6" />
//         )}
//       </button>

//       {/* Chat window */}
//       {isChatOpen && (
//         <div className="absolute bottom-16 sm:bottom-20 right-0 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="bg-white p-0 rounded-full mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden shadow-lg">
//                 <img
//                   src="/images/avatars/default-avatar.png"
//                   alt="บอทบุรีรัมย์"
//                   className="w-full h-full object-cover object-center"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234F46E5'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z'/%3E%3C/svg%3E";
//                   }}
//                 />
//               </div>
//               <div>
//                 <h1 className="text-base sm:text-lg font-bold text-white">
//                   น้องบุรี
//                 </h1>
//                 <p className="text-blue-100 text-xs">ผู้ช่วยด้านการท่องเที่ยวบุรีรัมย์</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="p-1.5 sm:p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
//             >
//               <X size={14} className="sm:w-4 sm:h-4" />
//             </button>
//           </div>

//           {/* Messages area */}
//           <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 shadow-md ${
//                     message.sender === "user"
//                       ? "bg-blue-500 text-white rounded-br-none"
//                       : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
//                   }`}
//                 >
//                   <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
//                     <ReactMarkdown
//                       components={{
//                         p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
//                         strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
//                         em: ({ children }) => <em className="italic">{children}</em>,
//                       }}
//                     >
//                       {message.text}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="max-w-[85%] sm:max-w-[80%] rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-100 p-2.5 sm:p-3 shadow-md">
//                   <div className="flex items-center">
//                     <div className="animate-bounce flex space-x-1">
//                       <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
//                       <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
//                       <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
//                     </div>
//                     <span className="ml-2 text-xs sm:text-sm">กำลังคิดคำตอบ...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input area */}
//           <div className="p-3 sm:p-4 border-t border-gray-200">
//             <div className="flex">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="ถามเกี่ยวกับสถานที่นี้..."
//                 className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-l-lg focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-500 placeholder-gray-500 border text-xs sm:text-sm"
//                 disabled={isLoading}
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={isLoading || !input.trim()}
//                 className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-r-lg transition ${
//                   isLoading || !input.trim()
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-blue-500 hover:bg-blue-600 text-white"
//                 }`}
//                 aria-label="ส่งข้อความ"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 sm:h-5 sm:w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {/* กด Enter เพื่อส่งข้อความ */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




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
      text: `สวัสดีค่ะ! 🌟 ยินดีต้อนรับสู่ ${locationName} ฉันอลิซ ผู้ช่วยด้านการท่องเที่ยวบุรีรัมย์ พร้อมให้ข้อมูลและคำแนะนำเกี่ยวกับสถานที่แห่งนี้ มีอะไรอยากรู้เพิ่มเติมไหมคะ?`,
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
            className="chatbot-toggler"
            aria-label="เปิด/ปิด chatbot"
          >
            <span className="toggler-icon">💬</span>
          </button>
        </SignInButton>
        <style jsx>{`
          .chatbot-toggler {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .chatbot-toggler:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
          }

          .toggler-icon {
            font-size: 24px;
            color: white;
          }

          @media (max-width: 480px) {
            .chatbot-toggler {
              bottom: 16px;
              right: 16px;
              width: 48px;
              height: 48px;
            }

            .toggler-icon {
              font-size: 20px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
        {/* Floating button to toggle chat */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="chatbot-toggler"
          aria-label={isChatOpen ? "ปิดแชทบอท" : "เปิดแชทบอท"}
        >
          <span className="toggler-icon">💬</span>
        </button>

        {/* Chat window */}
        {isChatOpen && (
          <div className={`chatbot ${isChatOpen ? 'show' : ''}`}>
            {/* Header */}
            <header className="chatbot-header">
              <div className="header-info">
                <div className="bg-white p-0 rounded-full mr-3 w-10 h-10 flex items-center justify-center overflow-hidden shadow-lg">
                  <img
                    src="/images/avatars/default-avatar.png"
                    alt="บอทบุรีรัมย์"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="bot-details">
                  <h2>อลิส - แชทบอทท่องเที่ยวบุรีรัมย์</h2>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="close-btn"
                aria-label="ปิดแชทบอท"
              >
                <span>✕</span>
              </button>
            </header>

            {/* Messages area */}
            <ul className="chatbox">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={`chat ${message.sender === "user" ? "outgoing" : ""}`}
                >
                  {message.sender === "user" ? (
                    <div className="chat-content">
                      <div className="user-message">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className="bot-message">
                      <div className="chat-content">
                        <div className="bot-response">
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
                  )}
                </li>
              ))}
              {isLoading && (
                <li className="chat">
                  <div className="bot-message">
                    <div className="bg-white p-0 rounded-full mr-3 w-10 h-10 flex items-center justify-center overflow-hidden shadow-lg">
                      <img
                        src="/images/avatars/default-avatar.png"
                        alt="บอทบุรีรัมย์"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="chat-content">
                      <div className="bot-response thinking">
                        กำลังคิดคำตอบ...
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>

            {/* Input area */}
            <div className="chat-input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="พิมพ์คำถามเกี่ยวกับการท่องเที่ยวบุรีรัมย์..."
                  className="chat-input-text"
                  disabled={isLoading}
                  maxLength={500}
                  autoComplete="off"
                  aria-label="พิมพ์ข้อความ"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="send-btn"
                  type="button"
                  aria-label="ส่งข้อความ"
                >
                  <span className="send-icon">📤</span>
                </button>
              </div>
              <div className="input-footer">
                <small>กด Enter เพื่อส่งข้อความ</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ปุ่มเปิด/ปิด chatbot */
        .chatbot-toggler {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-toggler:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .toggler-icon {
          font-size: 24px;
          color: white;
        }

        /* กล่องแชทบอท */
        .chatbot {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 400px;
          height: 580px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.13);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* หัวข้อแชทบอท */
        .chatbot-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 20px 20px 0 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bot-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bot-details h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .bot-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* พื้นที่แสดงข้อความ */
        .chatbox {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px 32px 20px;
          margin: 0;
          list-style: none;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .chatbox::-webkit-scrollbar {
          width: 6px;
        }

        .chatbox::-webkit-scrollbar-track {
          background: transparent;
        }

        .chatbox::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        /* ข้อความแชท */
        .chat {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .chat.outgoing {
          justify-content: flex-end;
        }

        .chat-content {
          max-width: 80%;
          word-wrap: break-word;
        }

        .user-message {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 18px 18px 4px 18px;
          font-size: 14px;
          line-height: 1.4;
        }

        .bot-message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          max-width: 85%;
        }

        .bot-message .bot-avatar {
          font-size: 16px;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          background: none;
        }

        .bot-response {
          background: white;
          padding: 12px 16px;
          border-radius: 18px 18px 18px 4px;
          font-size: 14px;
          line-height: 1.4;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* พื้นที่พิมพ์ข้อความ */
        .chat-input-container {
          background: white;
          padding: 18px 20px 22px 20px;
          border-top: 1px solid #e5e7eb;
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 2px;
        }

        .chat-input-text {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 18px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          background: #f9fafb;
        }

        .chat-input-text:focus {
          border-color: #667eea;
          background: white;
        }

        .chat-input-text:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-btn {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .send-icon {
          font-size: 16px;
          color: white;
        }

        .input-footer {
          margin-top: 8px;
          text-align: center;
        }

        .input-footer small {
          color: #6b7280;
          font-size: 12px;
        }

        /* Loading animation */
        .thinking {
          opacity: 0.7;
        }

        .thinking::after {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6b7280;
          animation: thinking 1.4s infinite ease-in-out both;
          margin-left: 4px;
        }

        @keyframes thinking {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .chatbot {
            width: 100vw;
            height: 100vh;
            bottom: 0;
            right: 0;
            border-radius: 0;
            max-width: 100vw;
            max-height: 100vh;
          }

          .chatbot-toggler {
            bottom: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
          }

          .toggler-icon {
            font-size: 20px;
          }

          .chatbot-header {
            border-radius: 0;
          }

          .bot-details h2 {
            font-size: 14px;
          }
          
          .chatbox {
            padding-bottom: 60px;
          }
        }
      `}</style>
    </>
  );
}