'use client';


import { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Initialize chatbot functionality after component mounts
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea") as HTMLTextAreaElement;
    const sendChatBtn = document.querySelector(".chat-input span");
    
    let userMessage: string | null = null; // Variable to store user's message
    const inputInitHeight = chatInput.scrollHeight;
    
    // API configuration
    const API_KEY = "AIzaSyDaMjgsRJa3OX1qPLSBW8fOWbSBinWQvgQ"; // Your API key here
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
 
    const createChatLi = (message: string, className: string) => {
      // Create a chat <li> element with passed message and className
      const chatLi = document.createElement("li");
      chatLi.classList.add("chat", `${className}`);
      let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector("p")!.textContent = message;
      return chatLi; // return chat <li> element
    }

    const generateResponse = async (chatElement: HTMLLIElement) => {
      const messageElement = chatElement.querySelector("p")!;
      // Define the properties and message for the API request
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ text: userMessage }] 
          }] 
        }),
      }
      // Send POST request to API, get response and set the reponse as paragraph text
      try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Unknown error');
        
        // Get the API response text and update the message element
        messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
      } catch (error: any) {
        // Handle error
        messageElement.classList.add("error");
        messageElement.textContent = error.message || "Oops! Something went wrong. Please try again.";
      } finally {
        chatbox?.scrollTo(0, chatbox.scrollHeight);
      }
    }

    const handleChat = () => {
      if (!chatInput) return;
      
      userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
      if (!userMessage) return;
      
      // Clear the input textarea and set its height to default
      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;
      
      // Append the user's message to the chatbox
      chatbox?.appendChild(createChatLi(userMessage, "outgoing"));
      chatbox?.scrollTo(0, chatbox.scrollHeight);
      
      setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox?.appendChild(incomingChatLi);
        chatbox?.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
      }, 600);
    }

    // Add event listeners
    chatInput?.addEventListener("input", () => {
      // Adjust the height of the input textarea based on its content
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput?.addEventListener("keydown", (e) => {
      // If Enter key is pressed without Shift key and the window 
      // width is greater than 800px, handle the chat
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });

    sendChatBtn?.addEventListener("click", handleChat);
    closeBtn?.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler?.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

    // Cleanup event listeners on component unmount
    return () => {
      chatInput?.removeEventListener("input", () => {});
      chatInput?.removeEventListener("keydown", () => {});
      sendChatBtn?.removeEventListener("click", handleChat);
      closeBtn?.removeEventListener("click", () => {});
      chatbotToggler?.removeEventListener("click", () => {});
    };
  }, []);

  return (
    <div>
      <button className="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hi there 👋<br />How can I help you today?</p>
          </li>
        </ul>
        <div className="chat-input">
          <textarea placeholder="Enter a message..." required></textarea>
          <span id="send-btn" className="material-symbols-rounded">send</span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;