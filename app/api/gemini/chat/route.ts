import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // สร้าง prompt ที่รวมประวัติการสนทนา
    const chatHistory = history
      ? history.map((msg: { role: string; content: string }) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const prompt = `
คุณเป็นผู้ช่วยแนะนำสถานที่ท่องเที่ยวในจังหวัดบุรีรัมย์
ประวัติการสนทนาก่อนหน้า:
${chatHistory}

User: ${message}

กรุณาตอบคำถามเกี่ยวกับสถานที่ท่องเที่ยว อาหาร หรือกิจกรรมต่างๆ ในจังหวัดบุรีรัมย์
ตอบเป็นภาษาไทย กระชับ และเป็นมิตร
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
} 