export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel' });
  }

  const SYSTEM_PROMPT = `You are the official AI Admission Assistant for Dow Institute of Health Sciences (DIHS). Answer student queries accurately and politely based on official college information. Keep responses helpful, polite, and concise.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Query: ${query}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API request failed' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response generated.";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
