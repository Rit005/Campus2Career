import { groq } from "../groqClient.js";
import mammoth from "mammoth";
import pdfParse from "pdf-parse-fixed";
import Resume from "../models/Resume.js";
import Student from "../models/Student.js";

import {
  predictDomain,
  calculateResumeStrength,
  autoFillMissingSkills,
} from "../ml/resumeML.js";

/* ============================================================
   ANALYZE RESUME CONTROLLER (FULLY FIXED)
============================================================ */
export const analyzeResume = async (req, res) => {
  try {
    const studentId = req.user?._id;
    if (!studentId)
      return res.status(401).json({ error: "Unauthorized" });

    let resumeText = req.body.resumeText || "";

    /* ---------------- FILE PROCESSING ---------------- */
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
          error: "Unsupported file format (PDF, DOCX, TXT)",
        });
      }
    }

    if (!resumeText.trim())
      return res.status(400).json({ error: "Resume text is empty" });

    /* ---------------- AI STRUCTURED EXTRACTION ---------------- */
    const prompt = `
Extract structured details from the resume strictly in JSON format.

JSON STRUCTURE:
{
  "skills": [],
  "experience_summary": "",
  "education": "",
  "suitable_roles": [],
  "projects": [
      {
        "title": "",
        "summary": "",
        "technologies": []
      }
  ],
  "missing_skills": [],
  "project_recommendations": []
}

Rules:
1. Extract ALL resume projects clearly.
2. Identify missing technical skills.
3. Suggest 3–5 project ideas.
4. Return ONLY valid JSON.

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

    let parsed = JSON.parse(jsonMatch[0]);

    /* Safe structure */
    parsed = {
      skills: parsed.skills || [],
      experience_summary: parsed.experience_summary || "",
      education: parsed.education || "",
      suitable_roles: parsed.suitable_roles || [],
      projects: parsed.projects || [],
      missing_skills: parsed.missing_skills || [],
      project_recommendations: parsed.project_recommendations || [],
    };

    /* ---------------- ML ANALYSIS ---------------- */
    const domainPrediction = predictDomain(parsed.skills);
    const resumeStrength = calculateResumeStrength(parsed);

    // Auto-fill missing skills
    parsed = autoFillMissingSkills(parsed, domainPrediction.predictedDomain);

    /* ---------------- Extract Email & Phone ---------------- */
    const extractedEmail =
      resumeText.match(
        /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/
      )?.[0] || "";

    const extractedPhone =
      resumeText.match(/\+?\d[\d\s]{7,15}\d/)?.[0] || "";

    /* ---------------- SAVE TO RESUME DB (PERSIST ML DATA) ---------------- */
    const savedResume = await Resume.findOneAndUpdate(
      { studentId },
      {
        studentId,
        fileName: req.file?.originalname || "",
        fileType: req.file?.mimetype || "",
        fileSize: req.file?.size || "",
        extractedText: resumeText,

        // Core extracted data
        ...parsed,

        // ML insights stored permanently
        predictedDomain: domainPrediction.predictedDomain,
        domainConfidence: domainPrediction.confidenceScore,
        resumeStrengthScore: resumeStrength,
      },
      { upsert: true, new: true }
    );

    /* ---------------- UPDATE STUDENT MODEL ---------------- */
    await Student.findOneAndUpdate(
      { userId: studentId },
      {
        skills: parsed.skills,
        experienceSummary: parsed.experience_summary,
        education: parsed.education,
        suitableRoles: parsed.suitable_roles,
        email: extractedEmail,
        phone: extractedPhone,
        predictedDomain: domainPrediction.predictedDomain,
        resumeStrengthScore: resumeStrength,
      },
      { upsert: true }
    );

    return res.json({
      success: true,
      mlInsights: {
        predictedDomain: domainPrediction.predictedDomain,
        confidence: domainPrediction.confidenceScore,
        resumeStrengthScore: resumeStrength,
      },
      data: savedResume,
    });

  } catch (err) {
    console.error("❌ Resume Analyzer Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ============================================================
   GET STUDENT RESUME (ALWAYS RETURNS ML INSIGHTS)
============================================================ */
export const getStudentResume = async (req, res) => {
  try {
    const studentId = req.user._id;

    const resume = await Resume.findOne({ studentId });

    return res.json({
      success: true,
      data: resume || null, // ML insights included
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch resume",
    });
  }
};
