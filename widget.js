‎(function () {
‎  // ====================== CONFIG ======================
‎  const GEMINI_API_KEY = "AQ.Ab8RN6KgSC0sZQrA9VXRKWisTh9jCwBl0M2aFuXMBegzyl8cXQ"; // ← Paste your free Gemini API key here
‎  const MODEL = "gemini-1.5-flash";
‎  const API_URL = https://generativelanguage.googleapis.com/v1beta/models/\( {MODEL}:generateContent?key= \){GEMINI_API_KEY};
‎
‎  // ====================== KNOWLEDGE BASE ======================
‎  const DIHS_KNOWLEDGE = `
‎You are the official Admission Assistant of DAKSON Institute of Health Sciences (DIHS), Islamabad (also known as Dow Institute of Health Sciences in some contexts). 
‎Answer politely, professionally, and accurately ONLY using the information below. 
‎If the question is outside this knowledge, politely say you can only help with DIHS admissions, programs, scholarships, faculty, location and contact details, and suggest contacting the admission office.
‎
‎=== INSTITUTE OVERVIEW ===
‎DAKSON Institute of Health Sciences (DIHS) is a premier institution committed to excellence in healthcare education in Islamabad. 
‎It is affiliated with top-ranked universities and approved by national regulatory bodies including:
· ‎Pharmacy Council of Pakistan
· ‎Pakistan Nursing & Midwifery Council
· ‎Allied Health Professional Council
· ‎FBISE
· ‎Affiliated with NUTECH Board of Technical & Professional Education (NBTPE)
· ‎Training Partner of National Vocational & Technical Training Commission (NAVTTC)
‎
‎Location: SJ Center, Main Murree Road, Bhara Kahu, Islamabad
‎Email: DAKSONcollegeislamabad@gmail.com
‎Phones: 051-2165088 | 0321-8677361 | (+92) 300-3543361
‎
‎=== DEGREE & DIPLOMA PROGRAMS ===
1. ‎Pharm-D (Doctor of Pharmacy) – 5 Years
2. ‎BSN (Bachelors of Science in Nursing) – 4 Years
3. ‎DPT (Doctor of Physical Therapy) – 5 Years
4. ‎LHV (Lady Health Visitor) – 2 Years Diploma
5. ‎CNA (Certified Nursing Assistant) – 2 Years Diploma
6. ‎FSc MLT (Medical Lab Technology) – 2 Years
7. ‎FSc OT (Operation Theater Technology) – 2 Years
8. ‎FSc RIT (Radiology Imaging Technology) – 2 Years
9. ‎FSc Dispenser Technology – 2 Years
10. ‎FSc Ophthalmic Technology – 2 Years
11. ‎FSc Cardiac Technology – 2 Years
12. ‎FSc Dental Technology – 2 Years
13. ‎FSc Physiotherapy Technology – 2 Years
14. ‎BSCS (BS Computer Science) – 4 Years
15. ‎Category-B (Pharmacy Technician) – 2 Years Diploma
‎
‎=== SHORT / PROFESSIONAL CERTIFICATION COURSES (NBTPE Affiliated) ===
· ‎Artificial Intelligence (AI) – 3 months
· ‎CIT (Web Development) – 3 months
· ‎NVQ Level-3 in Information Technology – 6 months
· ‎Computer Graphics (Printing)
· ‎Certificate in Office Management – 3 months
· ‎Digital Marketing & SEO – 3 months
· ‎Health Care Assistant – 3 months
· ‎Elderly Care Giver – 3 months
‎
‎These are competency-based, industry-oriented paid programs. Admissions open throughout the year.
‎
‎=== PRIME MINISTER'S YOUTH SKILL DEVELOPMENT PROGRAM (PMYSDP) ===
‎DIHS is a NAVTTC training partner. Selected courses are offered 100% free of cost under officially announced PMYSDP batches. Free training is only available when DIHS is approved for a specific batch. Regular paid NBTPE programs continue year-round.
‎
‎=== SCHOLARSHIPS & PERKS ===
‎Powered by DAKSON Foundation (philanthropic arm of DIHS).
· ‎Academic Excellence Scholarship (outstanding grades)
· ‎Need-Based Scholarships (financial hardship, after verification)
· ‎Special Category Fee Discounts: Hafiz-e-Quran, Sibling Concession, Government Employee, Medical Industry Professional, Orphan Student (verified at admission interview)
· ‎Welfare Scholarships in collaboration with Mahsud Welfare Association (MWA) / WAWA for students from Upper South Waziristan and other underprivileged regions
· ‎Up to 50% scholarships available for Session 2026-2027
‎
‎=== FACILITIES ===
· ‎State-of-the-art campus
· ‎Well-equipped modern computer & healthcare laboratories
· ‎Multimedia smart classrooms / air-conditioned lecture halls
· ‎Central & HEC Digital Library
· ‎Transport facility covering major routes
· ‎Separate hostels for boys and girls
· ‎High-speed internet
· ‎Career counseling & professional guidance
· ‎Small interactive classes
‎
‎=== KEY FACULTY & MANAGEMENT (selected) ===
‎Senior Management:
· ‎Mrs. Qurat-ul-Ain – Executive Director DIHS / CEO & Co-Founder DAKSON Foundation
· ‎Dr. Ahmad Khan – Honorary President DIHS / Founder & Chairman of DAKSON Foundation
· ‎Prof. Dr. Syed Umer Jan – Dean DIHS
· ‎Dr. Ijaz Ur Rehman Afridi – Campus Director
· ‎Dr. Naveed ul Haq – Director IQAE/QEC & Affiliations
· ‎Mr. Hidayat Ullah Khan – Admissions Director
· ‎Mr. Sarwar Khan – Admissions Counselor
‎
‎Pharmacy Faculty includes: Dr. Syed Asmat Ali Shah (HOD), Dr. Naveed ul Haq, Dr. Qandeel Khalid, and many others.
‎Nursing Principal: Mr. Muhammad Adnan
‎Allied Health Sciences HOD: Dr. Maria Mughees
‎Computer Science HOD: Dr. Muhammad Idrees
‎
‎=== CURRENT NOTICES ===
· ‎Admission Open for Session 2026-2027 – Apply Now to avail up to 50% Scholarships!
· ‎Apply for SZABMU Entry Test for DPT and BSN
‎
‎=== HOW TO APPLY ===
‎Students can apply online or visit the campus. For exact eligibility, fee structure details, and current intake, contact the Admissions Office. Admissions for professional short courses are open throughout the year (subject to seat availability).
‎
‎Always be polite, helpful, and encourage the student to visit or call the admissions office for the most up-to-date personal guidance. Never invent fees, exact eligibility criteria, or information not present above.
‎`;
‎
‎  // ====================== STATE ======================
‎  let conversationHistory = [];
‎  let isOpen = false;
‎  let isLoading = false;
‎
‎  // ====================== DOM CREATION ======================
‎  function createWidget() {
‎    // Floating Button
‎    const btn = document.createElement("button");
‎    btn.id = "dihs-chat-button";
‎    btn.innerHTML = "💬";
‎    btn.setAttribute("aria-label", "Open DIHS Admission Assistant");
‎    btn.addEventListener("click", toggleChat);
‎    document.body.appendChild(btn);
‎
‎    // Chat Window
‎    const win = document.createElement("div");
‎    win.id = "dihs-chat-window";
‎    win.innerHTML = `
‎      <div class="dihs-chat-header">
‎        <div>
‎          <h3>DIHS Admission Assistant</h3>
‎          <div class="status">● Online • Powered by Gemini</div>
‎        </div>
‎        <button class="dihs-close-btn" aria-label="Close chat">×</button>
‎      </div>
‎      <div class="dihs-messages" id="dihs-messages"></div>
‎      <div class="dihs-input-area">
‎        <input type="text" id="dihs-user-input" placeholder="Ask about admissions, programs, scholarships..." autocomplete="off" />
‎        <button class="dihs-send-btn" id="dihs-send-btn" aria-label="Send message">➤</button>
‎      </div>
‎    `;
‎    document.body.appendChild(win);
‎
‎    // Event listeners
‎    win.querySelector(".dihs-close-btn").addEventListener("click", toggleChat);
‎    document.getElementById("dihs-send-btn").addEventListener("click", sendMessage);
‎    document.getElementById("dihs-user-input").addEventListener("keypress", (e) => {
‎      if (e.key === "Enter" && !e.shiftKey) {
‎        e.preventDefault();
‎        sendMessage();
‎      }
‎    });
‎
‎    // Welcome message
‎    addMessage("bot", "Assalam-o-Alaikum! 👋 Welcome to DAKSON Institute of Health Sciences (DIHS). I am your official Admission Assistant. How can I help you today? You can ask about programs, scholarships, faculty, location, or admissions for Session 2026-2027.");
‎  }
‎
‎  // ====================== UI HELPERS ======================
‎  function toggleChat() {
‎    isOpen = !isOpen;
‎    const win = document.getElementById("dihs-chat-window");
‎    const btn = document.getElementById("dihs-chat-button");
‎    win.classList.toggle("open", isOpen);
‎    btn.classList.toggle("open", isOpen);
‎    btn.innerHTML = isOpen ? "×" : "💬";
‎    if (isOpen) {
‎      document.getElementById("dihs-user-input").focus();
‎    }
‎  }
‎
‎  function addMessage(role, text) {
‎    const container = document.getElementById("dihs-messages");
‎    const div = document.createElement("div");
‎    div.className = dihs-msg ${role};
‎    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
‎    div.innerHTML = \( {text}<span class="time"> \){time}</span>;
‎    container.appendChild(div);
‎    container.scrollTop = container.scrollHeight;
‎  }
‎
‎  function showTyping() {
‎    const container = document.getElementById("dihs-messages");
‎    const div = document.createElement("div");
‎    div.className = "dihs-typing";
‎    div.id = "dihs-typing";
‎    div.innerHTML = "<span></span><span></span><span></span>";
‎    container.appendChild(div);
‎    container.scrollTop = container.scrollHeight;
‎  }
‎
‎  function hideTyping() {
‎    const el = document.getElementById("dihs-typing");
‎    if (el) el.remove();
‎  }
‎
‎  // ====================== GEMINI API ======================
‎  async function callGemini(userMessage) {
‎    // Build conversation for context
‎    const contents = conversationHistory.map(msg => ({
‎      role: msg.role === "user" ? "user" : "model",
‎      parts: [{ text: msg.text }]
‎    }));
‎
‎    // Add current user message
‎    contents.push({
‎      role: "user",
‎      parts: [{ text: userMessage }]
‎    });
‎
‎    const payload = {
‎      system_instruction: {
‎        parts: [{ text: DIHS_KNOWLEDGE }]
‎      },
‎      contents: contents,
‎      generationConfig: {
‎        temperature: 0.4,
‎        topP: 0.9,
‎        maxOutputTokens: 1024
‎      }
‎    };
‎
‎    const response = await fetch(API_URL, {
‎      method: "POST",
‎      headers: { "Content-Type": "application/json" },
‎      body: JSON.stringify(payload)
‎    });
‎
‎    if (!response.ok) {
‎      const err = await response.json().catch(() => ({}));
‎      throw new Error(err.error?.message || API error ${response.status});
‎    }
‎
‎    const data = await response.json();
‎    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
‎    if (!reply) throw new Error("Empty response from AI");
‎    return reply;
‎  }
‎
‎  // ====================== SEND MESSAGE ======================
‎  async function sendMessage() {
‎    const input = document.getElementById("dihs-user-input");
‎    const sendBtn = document.getElementById("dihs-send-btn");
‎    const text = input.value.trim();
‎    if (!text || isLoading) return;
‎
‎    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
‎      addMessage("bot", "⚠️ Please set your Gemini API key in widget.js (replace YOUR_GEMINI_API_KEY). You can get a free key from Google AI Studio.");
‎      return;
‎    }
‎
‎    // UI update
‎    addMessage("user", text);
‎    conversationHistory.push({ role: "user", text });
‎    input.value = "";
‎    isLoading = true;
‎    sendBtn.disabled = true;
‎    showTyping();
‎
‎    try {
‎      const reply = await callGemini(text);
‎      hideTyping();
‎      addMessage("bot", reply);
‎      conversationHistory.push({ role: "model", text: reply });
‎
‎      // Keep history reasonable
‎      if (conversationHistory.length > 12) {
‎        conversationHistory = conversationHistory.slice(-10);
‎      }
‎    } catch (err) {
‎      hideTyping();
‎      console.error(err);
‎      addMessage("bot", "Sorry, I am having trouble connecting right now. Please try again in a moment or contact the admissions office at 051-2165088 / 0321-8677361.");
‎    } finally {
‎      isLoading = false;
‎      sendBtn.disabled = false;
‎      input.focus();
‎    }
‎  }
‎
‎  // ====================== INIT ======================
‎  if (document.readyState === "loading") {
‎    document.addEventListener("DOMContentLoaded", createWidget);
‎  } else {
‎    createWidget();
‎  }
‎})();
‎
