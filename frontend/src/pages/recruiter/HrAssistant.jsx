import { useState, useEffect, useRef } from "react";
import { Send, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import recruiterAPI from "../../api/recruiter";

const HrAssistant = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! I'm your HR Assistant. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    try {
      const res = await recruiterAPI.hrAssistant({ message: userMessage });

      setTimeout(() => {
        if (res.data.success) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: res.data.reply }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "⚠️ Unable to process. Try again later." }
          ]);
        }
        setTyping(false);
      }, 600);
    } catch (err) {
      console.error("HR Assistant Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Server error. Try again." }
      ]);
      setTyping(false);
    }
  };

  // ENTER key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  /* 🎤 Voice Recognition */
  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) =>
      setInput(event.results[0][0].transcript);

    recognition.start();
  };

  return (
    <div className="h-[90vh] flex flex-col justify-between p-6 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] rounded-3xl shadow-xl border border-gray-200">

      {/* HEADER */}
      <div className="pb-4 border-b border-gray-300">
        <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
          🤖 HR Assistant
        </h1>
        <p className="text-gray-600 mt-1">
          Your AI-powered hiring & recruitment helper.
        </p>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 p-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-inner border border-gray-100">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed backdrop-blur-sm
              ${m.from === "user"
                ? "bg-blue-600 text-white ml-auto rounded-br-none"
                : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
              }`}
          >
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm w-24 flex gap-2 items-center text-gray-600">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="mt-4 flex items-center gap-3 p-3 bg-white rounded-full border border-gray-300 shadow-lg">

        {/* Mic Button */}
        <button
          onClick={handleMicClick}
          className={`p-3 rounded-full shadow text-gray-700 hover:bg-gray-100 transition ${
            listening ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          <Mic size={20} />
        </button>

        {/* Text Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700"
          placeholder="Ask HR: job descriptions, interview tasks, salary insights…"
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default HrAssistant;
