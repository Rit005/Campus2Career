import { useState } from "react";
import { Send } from "lucide-react";

const HrAssistant = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I assist your HR tasks today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);

    // Dummy AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Here are some interview questions:\n1. Tell me about yourself\n2. Strengths & weaknesses\n3. Why should we hire you?" }
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="space-y-8 h-[80vh] flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900">🤖 HR Assistant</h1>

      <div className="flex-1 bg-white shadow rounded-xl p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg max-w-lg ${m.from === "user" ? "bg-primary-100 ml-auto" : "bg-gray-100"}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 input"
          placeholder="Ask: Generate interview questions"
        />
        <button onClick={sendMessage} className="bg-primary-600 text-white px-4 rounded-md">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default HrAssistant;
