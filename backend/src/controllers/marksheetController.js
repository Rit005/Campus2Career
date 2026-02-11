// src/controllers/marksheetController.js

import pdfParse from "pdf-parse-fixed";
import mammoth from "mammoth";
import Marksheet from "../models/Marksheet.js";

/*============================================================
  RAW TEXT EXTRACTOR
============================================================*/
const extractTextFromFile = async (buffer, mimeType) => {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType === "text/plain") {
    return buffer.toString("utf8");
  }

  throw new Error("Unsupported file type");
};

/*============================================================
  AUTO GRADE (Fallback Only)
============================================================*/
const autoAssignGrade = (percentage) => {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

/*============================================================
  PROPER MARKSHEET PARSER (NO AI)
============================================================*/
const parseMarksheetProperly = (text) => {
  /*----------------------------------------------------------
    1️⃣ Extract Subjects (Page 1 First Column)
  -----------------------------------------------------------*/
  const subjectRegex = /^[A-Z]{2,4}\s*\d+-[A-Za-z0-9\s&()]+/gm;
  const subjectMatches = text.match(subjectRegex) || [];

  // Remove duplicates while preserving order
  const subjectsUnique = [...new Set(subjectMatches)];

  /*----------------------------------------------------------
    2️⃣ Extract Final Total Marks + Grades (Page 3)
       Example format:
       76.00/100.00
       00
       B
  -----------------------------------------------------------*/
  const totalRegex = /(\d+\.\d+\/100\.00)\s*0*\s*([A-F])/g;

  const totals = [];
  let match;

  while ((match = totalRegex.exec(text)) !== null) {
    totals.push({
      marks: match[1],
      grade: match[2],
    });
  }

  /*----------------------------------------------------------
    3️⃣ Match Subjects With Totals By Index
  -----------------------------------------------------------*/
  const finalSubjects = subjectsUnique
    .map((name, index) => {
      const total = totals[index];
      if (!total) return null;

      const [obtained, max] = total.marks.split("/");

      return {
        name: name.trim(),
        marks: Number(obtained),
        maxMarks: Number(max),
        grade: total.grade,
      };
    })
    .filter(Boolean);

  /*----------------------------------------------------------
    4️⃣ Extract Semester, Year, CGPA
  -----------------------------------------------------------*/
  const semesterMatch = text.match(
    /Registration Pattern\s*:\s*(Semester\s*[IVX]+)/i
  );

  const yearMatch = text.match(/Session\s*:\s*(\d{4}-\d{4})/);

  const cgpaMatch = text.match(/CGPA\s*:\s*(\d+\.\d+)/);

  return {
    semester: semesterMatch ? semesterMatch[1] : "",
    year: yearMatch ? yearMatch[1] : "",
    cgpa: cgpaMatch ? cgpaMatch[1] : "",
    subjects: finalSubjects,
  };
};

/*============================================================
  UPLOAD MARKSHEET CONTROLLER
============================================================*/
export const uploadMarksheetController = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const buffer = req.file.buffer;

    const rawText = await extractTextFromFile(
      buffer,
      req.file.mimetype
    );

    const parsed = parseMarksheetProperly(rawText);

    if (!parsed.subjects.length) {
      return res.status(400).json({
        success: false,
        message: "Could not extract subject data properly",
      });
    }

    let percentage = "";

    /*----------------------------------------------------------
      Process Final Subjects
    -----------------------------------------------------------*/
    const subjects = parsed.subjects.map((sub) => {
      const pct = (sub.marks / sub.maxMarks) * 100;

      return {
        name: sub.name,
        marks: sub.marks,
        maxMarks: sub.maxMarks,
        grade: sub.grade || autoAssignGrade(pct),
      };
    });

    /*----------------------------------------------------------
      Auto Calculate Percentage
    -----------------------------------------------------------*/
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);

    if (totalMax > 0) {
      percentage = ((totalMarks / totalMax) * 100).toFixed(2);
    }

    /*----------------------------------------------------------
      Save to DB
    -----------------------------------------------------------*/
    const saved = await Marksheet.create({
      studentId: req.user._id,
      semester: parsed.semester || req.body.semester || "",
      year: parsed.year || "",
      subjects,
      cgpa: parsed.cgpa || "",
      percentage,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: buffer,
      uploadedAt: new Date(),
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};

/*============================================================
  GET ALL MARKSHEETS
============================================================*/
export const getAllMarksheets = async (req, res) => {
  try {
    const list = await Marksheet.find({
      studentId: req.user._id,
    }).sort({ uploadedAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load marksheets",
    });
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
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/*============================================================
  DASHBOARD ANALYTICS
============================================================*/
export const getAcademicDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const marksheets = await Marksheet.find({
      studentId,
    }).sort({ semester: 1 });

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
        if (!subjectStats[sub.name]) {
          subjectStats[sub.name] = { total: 0, count: 0 };
        }

        subjectStats[sub.name].total +=
          (sub.marks / sub.maxMarks) * 100;

        subjectStats[sub.name].count++;
      });
    });

    const subjectWisePerformance = Object.keys(subjectStats).map(
      (name) => ({
        name,
        average: (
          subjectStats[name].total /
          subjectStats[name].count
        ).toFixed(2),
      })
    );

    const overallPerformance = (
      marksheets.reduce(
        (sum, m) => sum + Number(m.percentage),
        0
      ) / marksheets.length
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
    res.status(500).json({
      success: false,
      message: "Dashboard error",
    });
  }
};
