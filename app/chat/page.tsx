'use client';

import { useEffect } from "react";
import popup from "@/lib/popup";
import bot from "@/lib/bot";

export default function ChatPage() {
  useEffect(() => {
    // เรียกใช้ฟังก์ชันเมื่อ component mount
    bot();
    popup();
  }, []);

  return (
    <div className="chat-page-container">
      {/* ปุ่มเปิด/ปิด chatbot */}
      <button className="chatbot-toggler" aria-label="เปิด/ปิด chatbot">
        <span className="toggler-icon">💬</span>
      </button>

      {/* กล่องแชทบอท */}
      <div className="chatbot" id="chatbot">
        {/* หัวข้อแชทบอท */}
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

            <div className="pr-3">
              <a
                href="https://line.me/R/ti/p/%40360xfcji"
                target="_blank"
                rel="noopener noreferrer"
                className="line-link"
                aria-label="ติดต่อทางไลน์"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="line-logo">
                  <path fill="#00c300" d="M12.5,42h23c3.59,0,6.5-2.91,6.5-6.5v-23C42,8.91,39.09,6,35.5,6h-23C8.91,6,6,8.91,6,12.5v23C6,39.09,8.91,42,12.5,42z"></path><path fill="#fff" d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001C36.203,26.879,37.113,24.764,37.113,22.417z M18.875,25.907h-2.604c-0.379,0-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687c0.379,0,0.687,0.308,0.687,0.687v4.521h1.917c0.379,0,0.687,0.308,0.687,0.687C19.562,25.598,19.254,25.907,18.875,25.907z M21.568,25.219c0,0.379-0.308,0.688-0.687,0.688s-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687s0.687,0.308,0.687,0.687V25.219z M27.838,25.219c0,0.297-0.188,0.559-0.47,0.652c-0.071,0.024-0.145,0.036-0.218,0.036c-0.215,0-0.42-0.103-0.549-0.275l-2.669-3.635v3.222c0,0.379-0.308,0.688-0.688,0.688c-0.379,0-0.688-0.308-0.688-0.688V20.01c0-0.296,0.189-0.558,0.47-0.652c0.071-0.024,0.144-0.035,0.218-0.035c0.214,0,0.42,0.103,0.549,0.275l2.67,3.635V20.01c0-0.379,0.309-0.687,0.688-0.687c0.379,0,0.687,0.308,0.687,0.687V25.219z M32.052,21.927c0.379,0,0.688,0.308,0.688,0.688c0,0.379-0.308,0.687-0.688,0.687h-1.917v1.23h1.917c0.379,0,0.688,0.308,0.688,0.687c0,0.379-0.309,0.688-0.688,0.688h-2.604c-0.378,0-0.687-0.308-0.687-0.688v-2.603c0-0.001,0-0.001,0-0.001c0,0,0-0.001,0-0.001v-2.601c0-0.001,0-0.001,0-0.002c0-0.379,0.308-0.687,0.687-0.687h2.604c0.379,0,0.688,0.308,0.688,0.687s-0.308,0.687-0.688,0.687h-1.917v1.23H32.052z"></path>
                </svg>
              </a>
            </div>

          </div>
          <button className="close-btn" aria-label="ปิดแชทบอท">
            <span>✕</span>
          </button>
        </header>

        {/* พื้นที่แสดงข้อความ */}
        <ul className="chatbox" id="chatbox" role="log" aria-live="polite">
          {/* ข้อความจะถูกเพิ่มที่นี่ผ่าน JavaScript */}
        </ul>

        {/* พื้นที่พิมพ์ข้อความ */}
        <div className="chat-input-container" id="chat-input">
          <div className="input-wrapper">
            <input
              id="chat-input-text"
              type="text"
              placeholder="พิมพ์คำถามเกี่ยวกับการท่องเที่ยวบุรีรัมย์..."
              maxLength={500}
              autoComplete="off"
              aria-label="พิมพ์ข้อความ"
            />
            <button
              id="send-btn"
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

      {/* CSS Styles */}
      <style jsx>{`
        .chat-page-container {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

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
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chatbot.show {
          display: flex;
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
          border-radius: 24px 24px 0 0;
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

        :global(.line-link) {
          display: inline-block;
          padding: 0;
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          line-height: 0;
        }

        :global(.line-logo) {
          width: 40px;
          height: auto;
          display: block;
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
          scroll-behavior: smooth;
        }

        .chatbox::-webkit-scrollbar {
          width: 6px;
        }
        .chatbox::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        /* ข้อความแชท */
        :global(.chat) {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        :global(.chat.outgoing) {
          justify-content: flex-end;
        }
        :global(.chat.incoming) {
          justify-content: flex-start;
        }
      

     
        :global(.place-detail-link) {
          color: #2563eb !important;
          text-decoration: underline;
          font-weight: 500;
          font-size: 12px;
        }
        :global(.place-detail-link:hover) {
          color: #1d4ed8 !important;
        }
        :global(.search-all-link) {
          display: inline-block;
          padding: 8px 16px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          margin-top: 10px;
          transition: background-color 0.2s;
        }
        :global(.search-all-link:hover) {
          background-color: #059669;
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

        #chat-input-text {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 18px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          background: #f9fafb;
        }

        #chat-input-text:focus {
          border-color: #667eea;
          background: white;
        }

        #chat-input-text:disabled {
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

          :global(.line-logo) {
            width: 28px;
          }
        }

        /* Loading animation */
        :global(.thinking) {
          opacity: 0.7;
        }

        :global(.thinking::after) {
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
      `}</style>
    </div>
  );
}






