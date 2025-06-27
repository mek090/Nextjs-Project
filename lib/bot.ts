function bot() {
    // ===================== ตัวแปร DOM =====================
    const chatbox = document.getElementById("chatbox") as HTMLUListElement | null;
    const chatInput = document.getElementById("chat-input-text") as HTMLInputElement | null;
    const sendChatBtn = document.getElementById("send-btn") as HTMLButtonElement | null;

    let userMessage: string = "";

    // ===================== ตัวแปร API =====================
    const API_KEY = "AIzaSyDaMjgsRJa3OX1qPLSBW8fOWbSBinWQvgQ";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // ===================== ตัวแปร Prompt =====================
    let basePrompt = "ฉันเป็นแชทบอทแนะนำการท่องเที่ยวจังหวัดบุรีรัมย์ที่เป็นมิตรและพร้อมให้ความช่วยเหลือ";

    // ===================== ฟังก์ชันดึงข้อมูลจาก API =====================
    async function loadPromptFromAPI() {
        try {
            const res = await fetch('/api/prompts');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return data.map(row => row.prompt12 || row.prompt || row.text || '').filter(Boolean);
            }
            return [];
        } catch (err) {
            console.error("Error loading prompt from API:", err);
            return [];
        }
    }

    async function loadPlacesFromAPI() {
        try {
            const res = await fetch('/api/locations');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
            return [];
        } catch (err) {
            console.error("Error loading places from API:", err);
            return [];
        }
    }

    // ===================== ฟังก์ชันจัดรูปแบบข้อมูลสถานที่ =====================
    function formatPlaceData(place: any): string {
        const details = [
            `ชื่อ: ${place.name}`,
            place.description ? `รายละเอียด: ${place.description}` : '',
            place.category ? `หมวดหมู่: ${place.category}` : '',
            place.districts ? `อำเภอ: ${place.districts}` : '',
            (place.openTime || place.closeTime) ? `เวลาเปิด-ปิด: ${place.openTime || 'ไม่ระบุ'} - ${place.closeTime || 'ไม่ระบุ'}` : '',
            place.price ? `ค่าใช้จ่าย: ${place.price}` : '',
            place.rating ? `เรตติ้ง: ${place.rating}` : '',
            place.id ? `PLACE_ID:${place.id}` : '',
            (place.image && place.image.length > 0) ? `รูปภาพ: ${place.image[0]}` : ''
        ].filter(Boolean);

        return details.join('\n');
    }

    // ===================== ฟังก์ชันเริ่มต้นการทำงานของบอท =====================
    async function initializeBot() {
        try {
            const [promptsData, placesData] = await Promise.all([
                loadPromptFromAPI(),
                loadPlacesFromAPI()
            ]);

            let combinedReference = [];

            if (promptsData && promptsData.length > 0) {
                combinedReference.push(`ข้อมูลอ้างอิง Prompt ทั่วไป:\n${promptsData.join('\n\n---\n\n')}`);
            }

            if (placesData && placesData.length > 0) {
                const formattedPlaces = placesData
                    .map(formatPlaceData)
                    .join('\n\n---\n\n');
                combinedReference.push(`ข้อมูลอ้างอิงสถานที่ท่องเที่ยว:\n${formattedPlaces}`);
            }

            if (combinedReference.length > 0) {
                basePrompt = `คุณเป็นแชทบอทแนะนำการท่องเที่ยวในจังหวัดบุรีรัมย์ที่เป็นมิตรและช่วยเหลือ ชื่อ "อลิส"

ใช้ข้อมูลอ้างอิงต่อไปนี้ในการตอบคำถาม:
${combinedReference.join('\n\n=====\n\n')}

หลักการตอบคำถาม:
1. ตอบด้วยภาษาไทยที่เป็นธรรมชาติและเป็นมิตร
2. ให้ข้อมูลที่ถูกต้องและครบถ้วน
3. เมื่อแนะนำสถานที่ ให้ใส่แท็ก [PLACE_ID:ค่า] หลังชื่อสถานที่
4. จัดรูปแบบข้อความให้อ่านง่าย ใช้ bullet points หรือเลขลำดับ
5. สอบถามเพิ่มเติมเพื่อให้คำแนะนำที่ตรงความต้องการ

ตัวอย่างการตอบ:
สวัสดีค่ะ! บุรีรัมย์มีสถานที่ท่องเที่ยวสวยๆ มากมายเลยค่ะ ขอแนะนำเด็ดๆ ให้คุณแล้วค่ะ! มีอะไรอยากถามไหม? 😊`;
            }

            // แสดงข้อความต้อนรับ
            setTimeout(() => {
                const welcomeMessage = "สวัสดีค่ะ! ฉันอลิส แชทบอทแนะนำการท่องเที่ยวจังหวัดบุรีรัมย์ 🌟\n\nพร้อมแนะนำสถานที่ท่องเที่ยวเด็ดๆ ให้คุณแล้วค่ะ! มีอะไรอยากถามไหม? 😊";
                const initialBotLi = createChatLi(welcomeMessage, "incoming");
                chatbox?.appendChild(initialBotLi);
                chatbox?.scrollTo(0, chatbox.scrollHeight);
            }, 800);

        } catch (error) {
            console.error("Error initializing bot:", error);
        }
    }

    // เรียกฟังก์ชันเริ่มต้น
    initializeBot();

    // ===================== ฟังก์ชันสร้างกล่องข้อความ =====================
    const createChatLi = (message: string, className: string): HTMLLIElement => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);

        let chatContent: string;
        if (className === "outgoing") {
            chatContent = `<p></p>`;
        } else {
            chatContent = `<p></p>`;
        }

        chatLi.innerHTML = chatContent;
        const p = chatLi.querySelector("p");
        if (p) {
            // ใช้ innerHTML สำหรับ bot เพื่อรองรับการจัดรูปแบบ, textContent สำหรับ user
            if (className === "incoming") {
                p.innerHTML = message.replace(/\n/g, '<br>');
            } else {
                p.textContent = message;
            }
        }
        return chatLi;
    };

    // ===================== ประวัติการสนทนา =====================
    let conversationHistory: { role: string; content: string }[] = [];

    // ===================== ฟังก์ชันประมวลผลลิงก์สถานที่ =====================
    function processPlaceLinks(text: string): string {
        // Remove markdown bold **...**
        let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1');
        const placeLinkRegex = /([\u0E00-\u0E7F\w\s.,'()-]+?)\[PLACE_ID:([A-Za-z0-9_-]+)\]/g;
        return cleaned.replace(placeLinkRegex, (match: string, placeName: string, placeId: string) => {
            const detailLink = ` <a href="/locations/${placeId}" target="_blank" class="place-detail-link" style="color: #2563eb; text-decoration: underline; font-weight: 500;">[ดูรายละเอียด]</a>`;
            return `${placeName.trim()}${detailLink}`;
        });
    }

    // ===================== เรียก Gemini API =====================
    const generateResponse = async (chatElement: HTMLLIElement) => {
        const messageElement = chatElement.querySelector("p");
        if (!messageElement) return;
        const safeUserMessage = userMessage ?? "";

        // เพิ่มคำถามผู้ใช้เข้าประวัติ
        conversationHistory.push({ role: "user", content: safeUserMessage });

        // สร้าง prompt พร้อมประวัติการสนทนา
        let prompt = `${basePrompt}\n\nประวัติการสนทนา:\n`;

        const recentHistory = conversationHistory.slice(-6); // เก็บแค่ 6 ข้อความล่าสุด
        for (const msg of recentHistory) {
            prompt += `${msg.role === "user" ? "ผู้ใช้" : "อลิส"}: ${msg.content}\n`;
        }

        prompt += `\nอลิส:`;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                },
            }),
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ API");
            }

            const rawText = data.candidates[0].content.parts[0].text;

            // ประมวลผลข้อความ
            let processedText = processPlaceLinks(rawText);
            // Remove any remaining markdown bold (failsafe)
            processedText = processedText.replace(/\*\*(.*?)\*\*/g, '$1');

            // เพิ่มลิงก์ค้นหาถ้าเกี่ยวข้องกับสถานที่ท่องเที่ยว
            if (processedText.includes('place-detail-link') ||
                rawText.includes('สถานที่') ||
                rawText.includes('ท่องเที่ยว')) {
                processedText += `<br><br><a href="/locations" target="_blank" class="search-all-link" style="display: inline-block; padding: 8px 16px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; margin-top: 10px;">🔍 ค้นหาสถานที่ท่องเที่ยวทั้งหมด</a>`;
            }

            // แสดงผลแบบ typing effect
            messageElement.innerHTML = processedText;

            // เพิ่มคำตอบเข้าประวัติ
            conversationHistory.push({ role: "bot", content: rawText });

        } catch (error: any) {
            console.error("API Error:", error);
            if (messageElement) {
                messageElement.innerHTML = `<span style="color: #ef4444;">ขออภัยค่ะ เกิดข้อผิดพลาด: ${error.message}</span>`;
            }
        } finally {
            // เปิดใช้งานการส่งข้อความอีกครั้ง
            if (sendChatBtn) sendChatBtn.disabled = false;
            if (chatInput) {
                chatInput.disabled = false;
                chatInput.focus();
            }
            if (chatbox) chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    };

    // ===================== สร้างการตอบสนองแบบ Quick Reply =====================
    function createQuickReplyForPlaces(places: any[]): string {
        if (!places || places.length === 0) return "";

        const topPlaces = places
            .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
            .slice(0, 5);

        let reply = `🌟 <strong>สถานที่ท่องเที่ยวยอดนิยมในบุรีรัมย์</strong><br><br>`;

        topPlaces.forEach((place, index) => {
            const emoji = ['🏛️', '🌸', '🏞️', '🎯', '⭐'][index] || '📍';
            if (place.id) {
                reply += `${emoji} <strong>${place.name}</strong> <a href="/locations/${place.id}" target="_blank" class="place-detail-link" style="color: #2563eb; text-decoration: underline; font-weight: 500;">[ดูรายละเอียด]</a><br>`;
            } else {
                reply += `${emoji} <strong>${place.name}</strong><br>`;
            }

            if (place.description) {
                reply += `&nbsp;&nbsp;&nbsp;&nbsp;${place.description.substring(0, 80)}${place.description.length > 80 ? '...' : ''}<br>`;
            }
            reply += `<br>`;
        });

        reply += `สนใจสถานที่ไหนเป็นพิเศษไหมคะ? หรือจะให้แนะนำตามความชอบก็ได้นะคะ!`;

        // Remove markdown bold from quick reply
        let cleanedReply = reply.replace(/\*\*(.*?)\*\*/g, '$1');
        return cleanedReply;
    }

    // ===================== ฟังก์ชันจัดการแชท =====================
    const handleChat = async () => {
        if (!chatInput || !chatbox || !sendChatBtn) return;

        userMessage = (chatInput.value ?? '').trim();
        if (!userMessage) return;

        // ล้างช่องพิมพ์และปิดการใช้งานปุ่ม
        chatInput.value = "";
        sendChatBtn.disabled = true;
        chatInput.disabled = true;

        // แสดงข้อความผู้ใช้
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // ตรวจสอบคำถามแนะนำสถานที่
        const suggestKeywords = [
            "แนะนำ", "ที่เที่ยว", "เที่ยวที่ไหน", "สถานที่", "ท่องเที่ยว",
            "เที่ยวบุรีรัมย์", "ยอดนิยม", "เด็ด", "ดัง", "แนวนะ", "ไปไหนดี"
        ];

        const isSuggestPlace = suggestKeywords.some(keyword =>
            userMessage.toLowerCase().includes(keyword)
        );

        if (isSuggestPlace) {
            try {
                const places = await loadPlacesFromAPI();
                if (places && places.length > 0) {
                    const reply = createQuickReplyForPlaces(places);

                    setTimeout(() => {
                        const incomingChatLi = createChatLi("", "incoming");
                        chatbox.appendChild(incomingChatLi);

                        const messageElement = incomingChatLi.querySelector("p");
                        if (messageElement) {
                            messageElement.innerHTML = reply;
                            if (sendChatBtn) sendChatBtn.disabled = false;
                            if (chatInput) {
                                chatInput.disabled = false;
                                chatInput.focus();
                            }
                        }
                    }, 600);
                    return;
                }
            } catch (error) {
                console.error("Error loading places for suggestion:", error);
            }
        }

        // ตอบคำถามทั่วไปผ่าน Gemini API
        setTimeout(() => {
            const incomingChatLi = createChatLi("Thinking", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    // ===================== Event Listeners =====================
    if (chatInput) {
        chatInput.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", handleChat);
    }
}

export default bot;