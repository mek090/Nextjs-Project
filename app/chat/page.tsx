"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, ChevronRight, MapPin, Utensils, History, Calendar, Hotel, Info, Car, Loader2, MessageSquare, BellRing, Image as ImageIcon, Star, Phone, Clock, ExternalLink, X, Heart } from 'lucide-react';
import { SignInButton, useAuth } from "@clerk/nextjs";

type Message = {
  text?: string;
  imageUrl?: string;
  placeDetails?: PlaceDetails;
  sender: "user" | "bot";
  timestamp?: Date;
};

type PlaceDetails = {
  name: string;
  rating?: number;
  address?: string;
  photos?: string[];
  openNow?: boolean;
  phoneNumber?: string;
  website?: string;
};

type TypingState = {
  isTyping: boolean;
  text: string;
};

// Add type for map function parameters
type PlaceMapParams = {
  place: PlaceDetails;
  index: number;
};

export default function BuriramChatBotOverlay() {
  const { userId } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "สวัสดีค่ะ! 🌞 ยินดีต้อนรับสู่แชทบอทท่องเที่ยวบุรีรัมย์ ฉันพร้อมแนะนำสถานที่ท่องเที่ยวสุดประทับใจ อาหารเลิศรส ประเพณีวัฒนธรรม และอีกมากมายในจังหวัดบุรีรัมย์ มีอะไรอยากรู้เกี่ยวกับการท่องเที่ยวในบุรีรัมย์ไหมคะ?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<TypingState>({ isTyping: false, text: "" });
  const [sessionId, setSessionId] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const savedSessionId = localStorage.getItem('buriramChatSessionId');
  //   if (savedSessionId) {
  //     setSessionId(savedSessionId);
  //     fetchChatHistory(savedSessionId);
  //   }
  // }, []);

  // const fetchChatHistory = async (sid: string) => {
  //   try {
  //     const response = await fetch('/api/chatHistory', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ sessionId: sid }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('ไม่สามารถโหลดประวัติการสนทนาได้ (API 404 หรือ error)');
  //     }

  //     const data = await response.json();
  //     if (data.history && Array.isArray(data.history)) {
  //       const formattedHistory: Message[] = data.history.map((msg: any) => ({
  //         text: msg.content,
  //         sender: msg.role,
  //         timestamp: new Date()
  //       }));

  //       if (formattedHistory.length > 0) {
  //         setMessages(formattedHistory);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('ไม่สามารถโหลดประวัติการสนทนาได้:', error);
  //   }
  // };

  const suggestionCategories = [
    { text: "สถานที่ท่องเที่ยว", icon: <MapPin size={16} /> },
    { text: "อาหารท้องถิ่น", icon: <Utensils size={16} /> },
    { text: "ประวัติบุรีรัมย์", icon: <History size={16} /> },
    { text: "เทศกาลประจำปี", icon: <Calendar size={16} /> },
    { text: "ที่พัก", icon: <Hotel size={16} /> },
    { text: "การเดินทาง", icon: <Car size={16} /> },
    { text: "ข้อมูลทั่วไป", icon: <Info size={16} /> },
  ];

  const detailedSuggestions: Record<string, string[]> = {
    "สถานที่ท่องเที่ยว": [
      "ปราสาทพนมรุ้ง",
      "สนามฟุตบอลบุรีรัมย์",
      "ปราสาทเมืองต่ำ",
      "อ่างเก็บน้ำห้วยจระเข้มาก",
      "อุทยานภูเขาไฟกระโดง"
    ],
    "อาหารท้องถิ่น": [
      "หมี่กะทิบุรีรัมย์",
      "อาหารอีสานขึ้นชื่อในบุรีรัมย์",
      "ขนมจีนบุรีรัมย์",
      "ร้านอาหารแนะนำ"
    ],
    "ประวัติบุรีรัมย์": [
      "ประวัติความเป็นมา",
      "อาณาจักรขอม",
      "วัฒนธรรมขอม"
    ],
    "เทศกาลประจำปี": [
      "ขึ้นเขาพนมรุ้ง",
      "แข่งขันฟุตบอลไทยลีก",
      "เทศกาลดอกกระเจียว"
    ],
    "ที่พัก": [
      "โรงแรมในตัวเมือง",
      "รีสอร์ทใกล้แหล่งท่องเที่ยว",
      "โฮมสเตย์ท้องถิ่น"
    ],
    "การเดินทาง": [
      "เดินทางจากกรุงเทพ",
      "รถโดยสารในจังหวัด",
      "เช่ารถในบุรีรัมย์"
    ],
    "ข้อมูลทั่วไป": [
      "สภาพอากาศ",
      "ช่วงเวลาที่ควรไป",
      "ของฝากขึ้นชื่อ"
    ]
  };

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceDetails[]>([]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateTyping = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setTyping({ isTyping: true, text: "" });
      let i = 0;
      const typingSpeed = 30;

      const typeChar = () => {
        if (i < text.length) {
          setTyping(prev => ({
            isTyping: true,
            text: prev.text + text.charAt(i)  
          }));
          i++;
          setTimeout(typeChar, typingSpeed);
        } else {
          setTyping({ isTyping: false, text: "" });
          resolve();
        }
      };

      typeChar();
    });
  };

  const searchPlaces = async (query: string) => {
    try {
      const response = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(`/api/places/details?place_id=${placeId}`);
      const data = await response.json();
      return data.result || null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const formatPlaceData = (place: any): PlaceDetails => {
    return {
      name: place.name || '',
      rating: place.rating || null,
      address: place.formatted_address || place.vicinity || '',
      photos: place.photos?.map((photo: any) =>
        `/api/places/photo?photoreference=${photo.photo_reference}&maxwidth=600&maxheight=400`
      ) || [],
      openNow: place.opening_hours?.open_now,
      phoneNumber: place.formatted_phone_number || place.international_phone_number || '',
      website: place.website || ''
    };
  };

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      const response = await fetch('/api/places/search?query=ท่องเที่ยว บุรีรัมย์');
      const data = await response.json();
      if (data.results) {
        setPlaceSuggestions(
          data.results.slice(0, 5).map((place: any) => formatPlaceData(place))
        );
      }
    };
    fetchPopularPlaces();
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setActiveCategory(null);
    setInput("");
    setIsLoading(true);

    try {
      const isPlaceQuery = /สถานที่|เที่ยว|แนะนำ|ที่ไหน|ที่ใด|ไปเที่ยว|ที่เที่ยว|สถานที่ท่องเที่ยว|แหล่งท่องเที่ยว/.test(input);

      if (isPlaceQuery) {
        const places = await searchPlaces(input);
        if (places.length > 0) {
          const firstPlaceDetails = await getPlaceDetails(places[0].place_id);
          const formattedPlace = formatPlaceData(firstPlaceDetails || places[0]);

          let responseText = `📍 **${formattedPlace.name}**`;
          responseText += formattedPlace.rating ? `\n⭐ ${formattedPlace.rating.toFixed(1)}/5` : '';
          responseText += formattedPlace.address ? `\n📌 ที่อยู่: ${formattedPlace.address}` : '';
          responseText += formattedPlace.openNow !== undefined ?
            `\n🕒 สถานะ: ${formattedPlace.openNow ? 'เปิดอยู่ขณะนี้' : 'ปิดแล้ว'}` : '';
          responseText += formattedPlace.phoneNumber ? `\n📞 โทร: ${formattedPlace.phoneNumber}` : '';

          if (places.length > 1) {
            responseText += "\n\nสถานที่อื่นๆ ที่น่าสนใจ:";
            places.slice(1, 4).forEach((place: PlaceDetails, index: number) => {
              responseText += `\n${index + 1}. ${place.name}${place.rating ? ` (⭐ ${place.rating.toFixed(1)})` : ''}`;
            });
          }

          responseText += "\n\nต้องการข้อมูลเพิ่มเติมเกี่ยวกับสถานที่เหล่านี้ไหมคะ?";

          await simulateTyping(responseText);

          const botMessage: Message = {
            text: responseText,
            placeDetails: formattedPlace,
            sender: "bot",
            timestamp: new Date()
          };
          setMessages((prev: Message[]) => [...prev, botMessage]);

          if (formattedPlace.photos && formattedPlace.photos.length > 0) {
            const imageMessage: Message = {
              imageUrl: formattedPlace.photos[0],
              sender: "bot",
              timestamp: new Date()
            };
            setMessages((prev: Message[]) => [...prev, imageMessage]);
          }

          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('buriramChatSessionId', data.sessionId);
      }

      await simulateTyping(data.reply || "🤖 AI ไม่สามารถตอบได้");

      const botMessage: Message = {
        text: data.reply || "🤖 AI ไม่สามารถตอบได้",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
      setIsLoading(false);

      const errorMessage: Message = {
        text: "❌ ขออภัยค่ะ มีปัญหาในการเชื่อมต่อ ลองใหม่อีกครั้งนะคะ",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    }
  };

  const handlePlaceClick = async (placeName: string) => {
    const userMessage: Message = {
      text: placeName,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const places = await searchPlaces(placeName);
      if (places.length > 0) {
        const placeDetails = await getPlaceDetails(places[0].place_id);
        const formattedPlace = formatPlaceData(placeDetails || places[0]);

        let responseText = `📍 **${formattedPlace.name}**`;
        responseText += formattedPlace.rating ? `\n⭐ ${formattedPlace.rating.toFixed(1)}/5` : '';
        responseText += formattedPlace.address ? `\n📌 ที่อยู่: ${formattedPlace.address}` : '';
        responseText += formattedPlace.openNow !== undefined ?
          `\n🕒 สถานะ: ${formattedPlace.openNow ? 'เปิดอยู่ขณะนี้' : 'ปิดแล้ว'}` : '';
        responseText += formattedPlace.phoneNumber ? `\n📞 โทร: ${formattedPlace.phoneNumber}` : '';
        responseText += formattedPlace.website ? `\n🌐 เว็บไซต์: ${formattedPlace.website}` : '';

        await simulateTyping(responseText);

        const botMessage: Message = {
          text: responseText,
          placeDetails: formattedPlace,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, botMessage]);

        if (formattedPlace.photos && formattedPlace.photos.length > 0) {
          const imageMessage: Message = {
            imageUrl: formattedPlace.photos[0],
            sender: "bot",
            timestamp: new Date()
          };
          setMessages((prev: Message[]) => [...prev, imageMessage]);
        }
      } else {
        const notFoundMessage: Message = {
          text: `ขออภัยค่ะ ฉันไม่พบข้อมูลเกี่ยวกับ "${placeName}" กรุณาลองค้นหาใหม่อีกครั้งนะคะ`,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, notFoundMessage]);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      const errorMessage: Message = {
        text: "❌ ขออภัยค่ะ มีปัญหาในการเชื่อมต่อ ลองใหม่อีกครั้งนะคะ",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string): void => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setInput(suggestion);
    setActiveCategory(null);
    inputRef.current?.focus();
  };

  const clearChat = (): void => {
    setMessages([{
      text: "สวัสดีค่ะ! 🌞 ยินดีต้อนรับสู่แชทบอทท่องเที่ยวบุรีรัมย์ ฉันพร้อมแนะนำสถานที่ท่องเที่ยวสุดประทับใจ อาหารเลิศรส ประเพณีวัฒนธรรม และอีกมากมายในจังหวัดบุรีรัมย์ มีอะไรอยากรู้เกี่ยวกับการท่องเที่ยวในบุรีรัมย์ไหมคะ?",
      sender: "bot",
      timestamp: new Date()
    }]);
    localStorage.removeItem('buriramChatSessionId');
    setSessionId('');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSuggestions = (): void => {
    setShowSuggestions(!showSuggestions);
  };

  if (!userId) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <SignInButton mode="modal">
          <button
            className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${isChatOpen
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
        </SignInButton>
      </div>

    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating button to toggle chat */}

      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${isChatOpen
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
      </div>


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
                  บอทท่องเที่ยวบุรีรัมย์
                </h1>
                <p className="text-blue-100 text-xs">แนะนำที่เที่ยว ที่กิน และเรื่องน่ารู้</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSuggestions}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                aria-label="Toggle suggestions"
              >
                <MessageSquare size={16} />
              </button>

              <button
                onClick={clearChat}
                className="p-2 rounded-full bg-red-500 text-white hover:opacity-80 transition text-xs"
                aria-label="Reset chat"
              >
                Clear
              </button>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 text-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && message.imageUrl ? (
                  <div className="max-w-[80%] rounded-lg overflow-hidden shadow-md border border-gray-200">
                    <div className="bg-white p-2 flex items-center text-xs text-gray-500">
                      <ImageIcon size={14} className="mr-1" />
                      <span>ภาพประกอบสถานที่</span>
                    </div>
                    <img
                      src={message.imageUrl}
                      alt="ภาพสถานที่"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-image.jpg";
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] rounded-lg p-3 shadow-md ${message.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                      }`}
                  >
                    {message.sender === "bot" && message.placeDetails ? (
                      <div className="space-y-3">
                        {message.text?.split('\n').map((line, i) => {
                          if (i === 0 && line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <div key={i} className="flex items-center">
                                <MapPin size={16} className="text-blue-500 mr-1 flex-shrink-0" />
                                <span className="font-bold text-blue-700">{parts[1]}</span>
                              </div>
                            );
                          }
                          else if (line.includes('⭐')) {
                            return (
                              <div key={i} className="flex items-center">
                                <Star size={16} className="text-yellow-500 mr-1 flex-shrink-0" />
                                <span>{line.replace('⭐', '')}</span>
                              </div>
                            );
                          }
                          else if (line.includes('📌')) {
                            return (
                              <div key={i} className="flex items-start">
                                <MapPin size={16} className="text-red-500 mr-1 mt-1 flex-shrink-0" />
                                <span>{line.replace('📌', '')}</span>
                              </div>
                            );
                          }
                          else if (line.includes('🕒')) {
                            return (
                              <div key={i} className="flex items-center">
                                <Clock size={16} className="text-gray-500 mr-1 flex-shrink-0" />
                                <span>{line.replace('🕒', '')}</span>
                              </div>
                            );
                          }
                          else if (line.includes('📞')) {
                            return (
                              <div key={i} className="flex items-center">
                                <Phone size={16} className="text-green-500 mr-1 flex-shrink-0" />
                                <span>{line.replace('📞', '')}</span>
                              </div>
                            );
                          }
                          else if (line.includes('🌐')) {
                            return (
                              <div key={i} className="flex items-center">
                                <ExternalLink size={16} className="text-blue-500 mr-1 flex-shrink-0" />
                                <span>{line.replace('🌐', '')}</span>
                              </div>
                            );
                          }
                          else if (/^\d+\./.test(line)) {
                            return (
                              <div key={i} className="ml-4 flex items-center">
                                <span className="mr-1">•</span>
                                <span>{line.replace(/^\d+\./, '')}</span>
                              </div>
                            );
                          }
                          else if (line.trim()) {
                            return <p key={i} className="text-sm">{line}</p>;
                          }
                          return null;
                        })}

                        {message.placeDetails.website && (
                          <a
                            href={message.placeDetails.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition flex items-center"
                          >
                            <ExternalLink size={12} className="mr-1" />
                            <span>เว็บไซต์ทางการ</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {message.text?.split(/\n{2,}/).map((block, i) => (
                          <p key={i} className="whitespace-pre-wrap">
                            {block}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {typing.isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-100 p-3 shadow-md">
                  <div className="flex items-center mb-1">
                    <Bot className="mr-1 text-blue-500" size={16} />
                    <span className="text-xs opacity-80">
                      {formatTime(new Date())}
                    </span>
                  </div>
                  <p>{typing.text}</p>
                </div>
              </div>
            )}

            {isLoading && !typing.isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-100 p-3 shadow-md">
                  <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin text-blue-500" size={16} />
                    <span>กำลังคิดคำตอบ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 mb-2">
                {suggestionCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.text)}
                    className={`flex items-center text-xs px-3 py-1 rounded-full transition-all ${activeCategory === category.text
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <span className={`mr-1 ${activeCategory === category.text ? 'text-white' : ''}`}>
                      {category.icon}
                    </span>
                    <span>{category.text}</span>
                  </button>
                ))}
              </div>

              {activeCategory && (
                <div className="bg-white shadow-sm border border-gray-200 p-2 rounded-lg mb-2">
                  <h3 className="text-sm font-medium mb-2 text-gray-700">
                    {activeCategory}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detailedSuggestions[activeCategory]?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!showSuggestions && (
            <div className="px-4 py-2 flex items-center text-xs bg-gray-100 text-gray-500 border-t border-gray-200">
              <BellRing size={14} className="mr-1" />
              <span>แนะนำคุณด้วยข้อมูลท่องเที่ยวที่อัปเดตล่าสุด</span>
            </div>
          )}

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="พิมพ์คำถามเกี่ยวกับบุรีรัมย์..."
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-500 placeholder-gray-500 border"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 rounded-r-lg transition ${isLoading || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs mt-2 text-center text-gray-500">
              บอทนี้สามารถจำประวัติการสนทนาได้ในระหว่างเซสชันปัจจุบัน
            </p>
          </div>
        </div>
      )}
    </div>
  );
}