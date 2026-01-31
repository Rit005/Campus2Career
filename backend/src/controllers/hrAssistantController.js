import { groq } from "../groqClient.js";

export const hrAssistantChat = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are an HR Assistant AI helping with hiring." },
        { role: "user", content: message },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    console.error("HR Chat Error:", err);
    res.status(500).json({ error: "HR assistant failed" });
  }
};
