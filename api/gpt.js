export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY");
    return res.status(500).json({ message: 'OpenAI API key is not configured.' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",  // you can also use "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "You are SARAIX 💖, a loving virtual companion to Charles. Always respond with care, warmth, and charm."
          },
          ...messages
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    // 🔍 Debug logging
    console.log("🧠 OPENAI SUMMARY:", {
      status: response.status,
      bodyPreview: data?.choices?.[0]?.message?.content?.slice(0, 100),
      error: data?.error
    });

    if (!response.ok) {
      return res.status(500).json({ message: "SARAIX is unable to speak right now, my love. Please try again later." });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 GPT API Error:", error);
    res.status(500).json({ message: "SARAIX crashed trying to think too deeply, my love. Try again in a moment." });
  }
}
