// src/controllers/marksheetController.js
import { groq } from "../groqClient.js";
import pdfParse from "pdf-parse-fixed";
import mammoth from "mammoth";
import fs from "fs";
import Marksheet from "../models/Marksheet.js";

/*============================================================
  RAW TEXT EXTRACTOR
============================================================*/
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

/*============================================================
  AUTO GRADE (Manual Rules)
============================================================*/
const autoAssignGrade = (percentage) => {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

/*============================================================
  AI PARSER (STRICT JSON + FIRST COLUMN SUBJECTS)
============================================================*/
const parseMarksheetWithAI = async (text) => {
  // Extract first-column subjects via regex fallback (Sem 4 needs this)
  const detectedSubjects =
    text.match(/^[A-Z]{2,4}\s*\d{3}[-A-Za-z0-9\s&()]*/gm) || [];

  const prompt = `
You MUST return ONLY valid JSON. No explanation. No markdown. No extra text.

STRICT RULE:
Return ONLY a JSON object.

TASK:
1. Extract subject names ONLY from the FIRST COLUMN of Page 1 & Page 2.
2. Ignore component names (Case Discussion, Quiz, Project 1, etc).
3. Extract FINAL TOTAL MARKS + FINAL GRADES from Page 3.
4. Match subjects and marks by ORDER.
5. Use these regex-detected subjects (in order) as the TRUE subjects:
${detectedSubjects.join("\n")}

OUTPUT FORMAT:
{
  "semester": "",
  "year": "",
  "cgpa": "",
  "percentage": "",
  "subjects": [
    { "name": "", "marks": "", "maxMarks": "", "grade": "" }
  ]
}

RULES:
- If final marks appear like "80.25/100.00", split correctly.
- If grade missing → grade = null.
- Return EXACT JSON ONLY — no other text.

NOW RETURN THE JSON OBJECT FOR THIS TEXT:
${text}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  /*---------------------------------------------------------
    CLEAN RAW OUTPUT → keep only text from first { to last }
  ----------------------------------------------------------*/
  let raw = response.choices[0].message.content;

  raw = raw.substring(raw.indexOf("{"));
  raw = raw.substring(0, raw.lastIndexOf("}") + 1);

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.log("\n🔥 AI RAW OUTPUT (Debug) 🔥\n", response.choices[0].message.content);
    throw new Error("AI returned invalid JSON – parsing failed.");
  }
};

/*============================================================
  UPLOAD MARKSHEET CONTROLLER
============================================================*/
export const uploadMarksheetController = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const buffer = fs.readFileSync(req.file.path);
    const rawText = await extractTextFromFile(buffer, req.file.mimetype);
    const parsed = await parseMarksheetWithAI(rawText);

    let cgpa = parsed.cgpa?.trim() || "";
    let percentage = parsed.percentage?.trim() || "";

    /*----------------------------------------------------------
      PROCESS FINAL SUBJECT RESULTS (Marks & Grades)
    -----------------------------------------------------------*/
    const subjects = parsed.subjects.map((sub) => {
      let obtained = 0,
        max = 0;

      if (String(sub.marks).includes("/")) {
        const parts = sub.marks.split("/");
        obtained = Number(parts[0]);
        max = Number(parts[1]);
      } else {
        obtained = Number(sub.marks);
        max = Number(sub.maxMarks);
      }

      const pct = (obtained / max) * 100;
      const grade = sub.grade || autoAssignGrade(pct);

      return {
        name: sub.name,
        marks: obtained,
        maxMarks: max,
        grade,
      };
    });

    /*----------------------------------------------------------
      AUTO CALCULATE % IF MISSING
    -----------------------------------------------------------*/
    if (!percentage && subjects.length > 0) {
      const total = subjects.reduce((sum, s) => sum + s.marks, 0);
      const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
      percentage = ((total / totalMax) * 100).toFixed(2);
    }

    const saved = await Marksheet.create({
      studentId: req.user._id,
      semester: parsed.semester || req.body.semester,
      year: parsed.year || "",
      subjects,
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

/*============================================================
  GET ALL MARKSHEETS
============================================================*/
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

/*============================================================
  DELETE MARKSHEET
============================================================*/
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

/*============================================================
  DASHBOARD ANALYTICS
============================================================*/
export const getAcademicDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const marksheets = await Marksheet.find({ studentId }).sort({
      semester: 1,
    });

    if (!marksheets.length) {
      return res.json({
        success: true,
        data: {
          overallPerformance: null,
          subjectWisePerformance: [],
          semesterTrend: [],
        },
      });
    }

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

    const overallPerformance = (
      marksheets.reduce((sum, m) => sum + Number(m.percentage), 0) /
      marksheets.length
    ).toFixed(2);

    const semesterTrend = marksheets.map((m) => ({
      semester: m.semester,
      cgpa: m.cgpa,
      percentage: m.percentage,
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
