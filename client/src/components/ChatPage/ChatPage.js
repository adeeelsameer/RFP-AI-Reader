import "./ChatPage.css";
import { useState } from "react";

function ChatPage() {
  const [inputValue, setInputValue] = useState(""); // Track input text
  const [conversation, setConversation] = useState([
    { role: "bot", text: "Hey there! Ask me anything about the RFP." },
  ]);
  const [send, setSend] = useState("idle"); // "idle" | "sending" | "sent" | "error"
  const [reply, setReply] = useState(null);

  const handleSendQuestion = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      console.error("No question provided");
      return;
    }

    setConversation((prev) => [...prev, { role: "user", text: trimmed }]);
    setSend("sending");
    setInputValue("");

    const response = await fetch("http://127.0.0.1:5000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: trimmed }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let botReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk
        .split("\n")
        .filter((line) => line.startsWith("data: "));

      for (const line of lines) {
        const token = line.replace("data: ", "").trim();
        if (token === "[DONE]") {
          setConversation((prev) => [...prev, { role: "bot", text: botReply }]);
          setSend("sent");
          return;
        }
        botReply += token;
        setConversation((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "bot") {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "bot", text: botReply };
            return updated;
          }
          return [...prev, { role: "bot", text: botReply }];
        });
      }
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">
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
