// src/controllers/marksheetController.js
import { groq } from "../groqClient.js";
import pdfParse from "pdf-parse-fixed";
import mammoth from "mammoth";
import fs from "fs";
import Marksheet from "../models/Marksheet.js";

/* ============================================================
   STEP 1: Extract raw text from uploaded files
   ============================================================ */
const extractTextFromFile = async (buffer, mimeType) => {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType === "text/plain") {
    return buffer.toString("utf8");
  }

  throw new Error("Unsupported file type");
};

/* ============================================================
   STEP 2: AI-Powered Marksheet Parsing
   ============================================================ */
const parseMarksheetWithAI = async (text) => {
  const prompt = `
Extract marksheet details STRICTLY as JSON:

RULES:
- Detect semester EXACTLY as written.
- Detect CGPA in ANY format:
    CGPA 9.04
    CGPA : 9.04
    Overall CGPA – 9.04
- Detect Percentage fields:
    Percentage: 83%
    Overall %: 78
    Marks 430/500
- If CGPA exists → DO NOT calculate percentage.
- If Percentage exists → DO NOT calculate CGPA.
- If both missing → calculate percentage from marks.

Return JSON ONLY:
{
  "semester": "",
  "year": "",
  "cgpa": "",
  "percentage": "",
  "subjects": [
    { "name": "", "marks": 0, "maxMarks": 0, "grade": "" }
  ]
}

Extract from the text below:
${text}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI returned invalid JSON");

  return JSON.parse(jsonMatch[0]);
};

/* ============================================================
   STEP 3: Upload Marksheet
   ============================================================ */
export const uploadMarksheetController = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const buffer = fs.readFileSync(req.file.path);
    const rawText = await extractTextFromFile(buffer, req.file.mimetype);

    const parsed = await parseMarksheetWithAI(rawText);

    let cgpa = parsed.cgpa?.trim() || "";
    let percentage = parsed.percentage?.trim() || "";

    // If both are missing → compute percentage
    if (!cgpa && !percentage && parsed.subjects.length > 0) {
      let total = 0;
      let max = 0;

      parsed.subjects.forEach((sub) => {
        total += Number(sub.marks || 0);
        max += Number(sub.maxMarks || 0);
      });

      if (max > 0) percentage = ((total / max) * 100).toFixed(2);
    }

    const saved = await Marksheet.create({
      studentId: req.user._id,
      semester: parsed.semester || req.body.semester,
      year: parsed.year || "",
      subjects: parsed.subjects,
      cgpa,
      percentage,
      filePath: req.file.path,
      fileName: req.file.originalname,
      uploadedAt: new Date(),
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   STEP 4: Get All Marksheets
   ============================================================ */
export const getAllMarksheets = async (req, res) => {
  try {
    const list = await Marksheet.find({ studentId: req.user._id }).sort({
      uploadedAt: -1,
    });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load marksheets" });
  }
};

/* ============================================================
   STEP 5: Delete a Marksheet
   ============================================================ */
export const deleteMarksheet = async (req, res) => {
  try {
    await Marksheet.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

/* ============================================================
   STEP 6: Academic Dashboard Analytics
   ============================================================ */
export const getAcademicDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const marksheets = await Marksheet.find({ studentId }).sort({ semester: 1 });

    if (!marksheets.length) {
      return res.json({
        success: true,
        data: {
          overallPerformance: null,
          subjectWisePerformance: [],
          semesterTrend: []
        }
      });
    }

    /* -------------------- Subject Wise Performance -------------------- */
    const subjectStats = {};

    marksheets.forEach((m) => {
      m.subjects.forEach((sub) => {
        if (!subjectStats[sub.name])
          subjectStats[sub.name] = { total: 0, count: 0 };

        subjectStats[sub.name].total += (sub.marks / sub.maxMarks) * 100;
        subjectStats[sub.name].count++;
      });
    });

    const subjectWisePerformance = Object.keys(subjectStats).map((name) => ({
      name,
      average: (subjectStats[name].total / subjectStats[name].count).toFixed(2),
    }));

    /* -------------------- Overall Performance -------------------- */
    const overallPerformance = (
      marksheets.reduce(
        (s, m) => s + Number(m.percentage || 0),
        0
      ) / marksheets.length
    ).toFixed(2);

    /* -------------------- Semester Trend -------------------- */
    const semesterTrend = marksheets.map((m) => ({
      semester: m.semester,
      cgpa: m.cgpa || "",
      percentage: m.percentage || "",
    }));

    res.json({
      success: true,
      data: {
        overallPerformance,
        subjectWisePerformance,
        semesterTrend,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

