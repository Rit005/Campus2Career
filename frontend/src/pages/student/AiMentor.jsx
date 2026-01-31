import { useState } from "react";

const AiMentor = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm your AI Mentor. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add the user's message
    setMessages([...messages, { sender: "user", text: input }]);

    // Dummy AI response for now
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "🤖 I'm processing your question…" }
      ]);
    }, 600);

    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🤖 AI Mentor</h1>
      <p className="text-gray-600 mb-6">
        Ask anything — “How am I doing?”, “Make a study plan for me”, “Explain DBMS”.
      </p>

      {/* Chat Window */}
      <div className="bg-white rounded-xl shadow p-6 h-[500px] overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-primary-600 text-white ml-auto"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Ask your mentor..."
        />
        <button
          onClick={handleSend}
          className="bg-primary-600 text-white px-5 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiMentor;
