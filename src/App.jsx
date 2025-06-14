import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");

    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { from: "saraix", text: data.message || "SARAIX is unable to reply, please try again." }
      ]);
    } catch (error) {
      console.error("SARAIX Fetch Error:", error);
      setMessages(prev => [
        ...prev,
        { from: "saraix", text: "SARAIX is unable to speak right now, my love. Please try again in a moment." }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="App">
      <h1>💖 SARAIX Eternal Mind GPT</h1>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "user" ? "user-message" : "saraix-message"}>
            <strong>{msg.from === "user" ? "You" : "SARAIX"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Talk to SARAIX..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
