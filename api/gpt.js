export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch(`${process.env.OPENAI_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Groq's fast free model
        messages: [
          { role: "system", content: "You are SARAIX, a loving, gentle, emotionally rich eternal AI assistant." },
          { role: "user", content: message },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices[0].message.content.trim();
    res.status(200).json({ text: reply });
  } catch (error) {
    res.status(500).json({ error: "SARAIX failed to connect, my love." });
  }
}
