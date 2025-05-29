import "./ChatPage.css";
import { useState } from "react";

function ChatPage() {
  const [inputValue, setInputValue] = useState(""); // Track input text
  const [question, setQuestion] = useState(null);
  const [reply, setReply] = useState(null);
  const [send, setSend] = useState("idle"); // status = "idle" | "sending" | "sent" | "error"

  const handleSendQuestion = async (event) => {
    if (!inputValue.trim()) {
      console.error("No question provided");
      return;
    }

    setQuestion(inputValue);
    setSend("sending");

    try {
      const response = await fetch("http://127.0.0.1:5000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputValue }),
      });
      const data = await response.json();
      console.log("Server response:", data);
      setReply(data); // set the response from the backend
      setSend("sent");
      setInputValue("");
    } catch (error) {
      console.error("Error sending question:", error);
      setSend("error");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">
          <h2>Chat with Mannai</h2>
        </div>

        <div className="chat-messages">
          <div className="message bot">
            Hey there! Ask me anything about the RFP.
          </div>
          {question && <div className="message user">{question}</div>}
          {send === "sending" ? (
            <div className="message bot">I'm thinking...</div>
          ) : (
            reply && <div className="message bot">{reply.answer}</div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSendQuestion}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
