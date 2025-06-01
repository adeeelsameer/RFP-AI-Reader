import "./ChatPage.css";
import { useState, useEffect, useRef } from "react";

function ChatPage({ onBack }) {
  const [inputValue, setInputValue] = useState(""); // Track input text
  const [conversation, setConversation] = useState([
    { role: "bot", text: "Hey there! Ask me anything about the RFP." },
  ]);
  const [send, setSend] = useState("idle"); // "idle" | "sending" | "sent" | "error"

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, send]);

  const handleSendQuestion = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      console.error("No question provided");
      return;
    }

    setConversation((prev) => [...prev, { role: "user", text: trimmed }]);
    setSend("sending");
    setInputValue("");

    try {
      const response = await fetch("http://127.0.0.1:5000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      setConversation((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer,
        },
      ]);
      setSend("sent");
    } catch (error) {
      console.error("Error sending question:", error);
      setSend("error");
      setConversation((prev) => [
        ...prev,
        { role: "bot", text: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Chat with Mannai</h2>
        </div>

        <div className="chat-messages">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}

          {send === "sending" && (
            <div className="message bot">I'm thinking...</div>
          )}

          {/* 👇 Invisible div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendQuestion();
            }}
          />
          <button onClick={handleSendQuestion}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
