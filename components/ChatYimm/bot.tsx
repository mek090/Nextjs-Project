'use client'

import { useEffect } from "react";
import Bot from '../../lib/bot'
import popup from '../../lib/popup'



const bot = () => {
    useEffect(() => {

        popup();
        Bot();

    })
    return (
        <div>

            <button className="chatbot-toggler">♦️</button>

            <div className="chatbot" id="chatbot">
                <section className="chatbot-header">
                    <h2>Chat Bot</h2>
                    <span className="close-btn">❌</span>
                </section>
                <ul className="chatbox" id="chatbox"></ul>
                <div className="chat-input" id="chat-input">
                    <input id="chat-input-text" placeholder="พิมพ์ข้อความ..." />
                    <button id="send-btn" className="send-btn">▶</button>
                </div>
            </div>


        </div>
    )
}
export default bot