(function () {
  // Key automatically Vercel Environment variable se load ho sakti hai ya runtime pass hogi
  const GEMINI_API_KEY = typeof process !== "undefined" && process.env?.GEMINI_API_KEY 
    ? process.env.GEMINI_API_KEY 
    : "";

  const SYSTEM_PROMPT = `You are the official AI Admission Assistant for Dow Institute of Health Sciences (DIHS). Answer student queries accurately and politely based on official college information. Keep responses helpful, polite, and concise.`;

  function initWidget() {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "dihs-widget-root";
    widgetContainer.innerHTML = `
      <button id="chat-toggle-btn" class="chat-widget-button">💬</button>
      <div id="chat-box" class="chat-widget-box hidden">
        <div class="chat-header">
          <span>DIHS Assistant</span>
          <button id="chat-close-btn" class="chat-close-btn">&times;</button>
        </div>
        <div id="chat-messages" class="chat-messages">
          <div class="message bot">Hello! Welcome to DIHS. How can I help you with admissions or courses today?</div>
        </div>
        <div class="chat-input-container">
          <input type="text" id="chat-input" placeholder="Ask a question..." />
          <button id="chat-send-btn">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(widgetContainer);

    const toggleBtn = document.getElementById("chat-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatBox = document.getElementById("chat-box");
    const sendBtn = document.getElementById("chat-send-btn");
    const inputField = document.getElementById("chat-input");
    const messagesContainer = document.getElementById("chat-messages");

    toggleBtn.addEventListener("click", () => chatBox.classList.toggle("hidden"));
    closeBtn.addEventListener("click", () => chatBox.classList.add("hidden"));

    async function sendMessage() {
      const query = inputField.value.trim();
      if (!query) return;

      appendMessage(query, "user");
      inputField.value = "";

      const loadingMsg = appendMessage("Typing...", "bot");

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Query: ${query}` }]
                }
              ]
            })
          }
        );

        const data = await response.json();
        loadingMsg.remove();

        if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          appendMessage(data.candidates[0].content.parts[0].text, "bot");
        } else {
          const errDetail = data.error?.message || "Error processing request.";
          appendMessage(`API Error: ${errDetail}`, "bot");
        }
      } catch (err) {
        loadingMsg.remove();
        appendMessage("Network connection failed. Please try again.", "bot");
      }
    }

    function appendMessage(text, sender) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `message ${sender}`;
      msgDiv.textContent = text;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msgDiv;
    }

    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
