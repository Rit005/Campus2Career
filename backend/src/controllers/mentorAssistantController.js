import { groq } from "../groqClient.js";
import Resume from "../models/Resume.js";

export const mentorAssistantChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Ensure logged-in student
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Load student's resume if available
    const resume = await Resume.findOne({ studentId: userId });

    const resumeText = resume?.extractedText || "Resume not uploaded yet.";

    // System prompt for personalized AI mentor
    const systemPrompt = `
You are an **AI Mentor** helping students with interview preparation, resume review, career guidance and mock interviews.

## STUDENT RESUME:
${resumeText}

## YOUR RULES
1. Always personalize responses using the resume.
2. If resume is missing, still give general guidance.
3. If student says:
   - “tell me about myself”
   - “give interview questions”
   - “mock interview”
   - “improve my resume”
   - “which skills should I learn”
   → ALWAYS give deeply personalized results.
4. If the student wants a mock interview:
   - Ask 1 interview question at a time.
   - Wait for the student's answer.
   - Evaluate their answer.
   - Give improvement suggestions.
   - Then ask the next question.
5. Tone must be friendly, motivating and professional.

Now respond to the student's message below:
`;

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const aiReply = response.choices?.[0]?.message?.content || "No response from AI.";

    return res.json({
      success: true,
      reply: aiReply,
    });

  } catch (err) {
    console.error("AI Mentor Error:", err);
    return res.status(500).json({
      success: false,
      error: "AI Mentor failed",
      details: err.message,
    });
  }
};
