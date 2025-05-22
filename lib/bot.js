// import  supabase  from "../utils/supabase";

function bot() {
    //ออ่านข้อมูลจาก data
    let basePrompt = " ";
    async function getAllFiles(data, path = '') {
        let allFiles = [];

        const { data: items, error } = await supabase
            .storage
            .from(data)
            .list(path, { limit: 100 });

        if (error) {
            console.error(`Error listing path "${path}":`, error);
            return allFiles;
        }

        for (const item of items) {
            if (item.name.endsWith('/')) continue; // skip folders
            if (item.metadata?.mimetype === 'application/vnd.google-apps.folder') continue;

            if (item.name && item.name.includes('.')) {
                // It's a file
                allFiles.push(path ? `${path}/${item.name}` : item.name);
            } else if (item.name) {
                // It's a folder, recurse into it
                const subFiles = await getAllFiles(data, path ? `${path}/${item.name}` : item.name);
                allFiles = allFiles.concat(subFiles);
            }
        }

        return allFiles;
    }

    // โหลดข้อมูลจาก bucket ชื่อ 'data'
    async function loadDataFromSupabase(data = 'data') {
        const filePaths = await getAllFiles(data);

        let combinedText = "";

        for (const path of filePaths) {
            // อ่านไฟล์ทั้งหมด ไม่จำกัดเฉพาะ .txt แล้ว (แต่คุณจะกรองก็ได้)
            const { data: fileData, error: downloadError } = await supabase
                .storage
                .from(data)
                .download(path);

            if (downloadError) {
                console.error(`Error downloading ${path}:`, downloadError);
                continue;
            }

            const text = await fileData.text();
            combinedText += `\n\n[${path}]\n${text}`;
        }

        if (combinedText.trim()) {
            basePrompt = `ข้อมูลอ้างอิง:\n${combinedText}\n\nจากข้อมูลข้างต้น กรุณาช่วยตอบคำถามของผู้ใช้อย่างชัดเจนและถูกต้อง`;
        }
    }


    // เรียกโหลดข้อมูลก่อนเริ่มต้น
    loadDataFromSupabase();





    // ===================== ตัวแปร DOM =====================
    const chatbox = document.getElementById("chatbox");
    const chatInput = document.getElementById("chat-input-text");
    const sendChatBtn = document.getElementById("send-btn");

    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;

    // // ===================== ตัวแปร API =====================
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // ===================== ตัวแปร Prompt =====================
    // let basePrompt = "ฉันเป็นแชทบอทที่เป็นมิตรและพร้อมให้ความช่วยเหลือ กรุณาถามคำถามใดๆ ที่คุณต้องการ";

    // ===================== ฟังก์ชันสร้างกล่องข้อความ =====================
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined"></span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };

    // ===================== เรียก API =====================
    let conversationHistory = [];

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");

        // เก็บคำถามผู้ใช้ล่าสุด
        conversationHistory.push({ role: "user", content: userMessage });
        const recentHistory = conversationHistory.slice(-5);
        // สร้าง prompt จากประวัติ + ข้อมูลจากไฟล์
        let prompt = `${basePrompt}\n\n`;

        for (const msg of conversationHistory) {
            prompt += `${msg.role === "user" ? "ผู้ใช้" : "แชทบอท"}: ${msg.content}\n`;
        }

        prompt += `\nแชทบอท:`;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);

            const rawText = data.candidates[0].content.parts[0].text;

            // แสดงข้อความใน UI
            messageElement.innerHTML = rawText;

            // 👉 เพิ่มคำตอบของแชทบอทเข้า history
            conversationHistory.push({ role: "bot", content: rawText });

        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = error.message;
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
            sendChatBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    };


    // ===================== ฟังก์ชันจัดการแชท =====================
    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        sendChatBtn.disabled = true;
        chatInput.disabled = true;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Thinking...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    // ===================== Event Listeners =====================
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);

    // ===================== เริ่มต้น =====================
    setTimeout(() => {
        const startBotMessage = "สวัสดี! ต้องการให้ช่วยอะไรเกี่ยวกับการท่องเที่ยวในจังหวัดบุรีรัมย์ไหมคะ?";
        const initialBotLi = createChatLi(startBotMessage, "incoming");
        chatbox.appendChild(initialBotLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 800);


}

export default bot;