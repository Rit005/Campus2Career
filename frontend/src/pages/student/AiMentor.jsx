import { useState, useEffect, useRef } from "react";
import { Send, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import studentAPI from "../../api/student";

const AiMentor = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm your AI Mentor. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await studentAPI.aiMentor({ message: userMessage });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: res.data.reply }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠️ Unable to process. Please try again." }
        ]);
      }
    } catch (err) {
      console.error("AI Mentor Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Server error. Try again." }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported on this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <div className="h-[80vh] flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg">

      <h1 className="text-3xl font-bold text-gray-900 mb-3">🎓 AI Mentor</h1>
      <p className="text-gray-600 mb-4 text-sm">
        Ask: *"Mock interview", "Improve my resume", "Explain DBMS", "Give study plan"*
      </p>

      <div className="flex-1 bg-white rounded-xl shadow-inner p-6 overflow-y-auto space-y-4 border border-gray-200">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xl text-sm leading-relaxed shadow-sm ${
              m.from === "user"
                ? "bg-blue-600 text-white ml-auto rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}
          >
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3 items-center mt-4">
        <button
          onClick={handleMicClick}
          className={`p-3 rounded-full shadow border ${
            listening ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          <Mic size={20} />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-3 border rounded-full shadow bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ask your mentor..."
        />

        <button
          onClick={sendMessage}
          className="p-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AiMentor;
