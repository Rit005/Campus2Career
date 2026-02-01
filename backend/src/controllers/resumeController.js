import { groq } from "../groqClient.js";
import mammoth from "mammoth";
import pdfParse from "pdf-parse-fixed";
import Resume from "../models/Resume.js";

export const analyzeResume = async (req, res) => {
  try {
    console.log("🔍 USER:", req.user);
    console.log("📄 FILE:", req.file);

    const studentId = req.user?._id;
    if (!studentId) return res.status(401).json({ error: "Unauthorized" });

    let resumeText = req.body.resumeText || "";

    // ===== FILE PROCESSING =====
    if (req.file) {
      const buffer = req.file.buffer;
      const type = req.file.mimetype;

      if (type === "application/pdf") {
        const pdfData = await pdfParse(buffer);
        resumeText = pdfData.text;
      } else if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docxData = await mammoth.extractRawText({ buffer });
        resumeText = docxData.value;
      } else if (type === "text/plain") {
        resumeText = buffer.toString("utf8");
      } else {
        return res.status(400).json({
          error: "Unsupported file format (PDF, DOCX, TXT)"
        });
      }
    }

    if (!resumeText.trim())
      return res.status(400).json({ error: "Resume text is empty" });

    // ===== AI PROMPT =====
    const prompt = `
You are a strict JSON generator.
Return ONLY valid JSON.

{
  "skills": [],
  "experience_summary": "",
  "education": "",
  "suitable_roles": []
}

Resume:
${resumeText}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("Invalid JSON from AI");

    const parsed = JSON.parse(jsonMatch[0]);

    // ===== SAVE TO DB =====
    const saved = await Resume.findOneAndUpdate(
      { studentId },
      {
        studentId,
        fileName: req.file?.originalname || "",
        fileType: req.file?.mimetype || "",
        fileSize: req.file?.size || "",
        extractedText: resumeText,
        ...parsed,
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: saved });

  } catch (err) {
    console.error("❌ Resume Analyzer Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getStudentResume = async (req, res) => {
  try {
    const studentId = req.user._id;
    const resume = await Resume.findOne({ studentId });

    res.json({ success: true, data: resume || null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};
