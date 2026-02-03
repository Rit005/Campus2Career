import { groq } from "../groqClient.js";

export const hrAssistantChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an HR Assistant AI helping with hiring." },
        { role: "user", content: message },
      ],
    });

    // Extract correct Groq message
    const aiReply = response.choices?.[0]?.message?.content || "No response from AI.";

    return res.json({
      success: true,
      reply: aiReply,
    });

  } catch (err) {
    console.error("HR Chat Error:", err);
    return res.status(500).json({
      success: false,
      error: "HR assistant failed",
      details: err.message,
    });
  }
};
