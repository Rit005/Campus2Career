import pdfParse from "pdf-parse-fixed";
import mammoth from "mammoth";
import Marksheet from "../models/Marksheet.js";
import Tesseract from "tesseract.js";
import { getMLPredictions } from "../ml/mlService.js";
import {
  predictAcademicDomain,
  detectWeakSubjects,
  analyzeTrend,
  generateImprovementRoadmap,
} from "../ml/academicML.js";

//pdf Parser
const extractTextFromFile = async (buffer, mimeType) => {
  try {
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

    const imageFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (imageFormats.includes(mimeType)) {
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, "eng");

      return text;
    }

    throw new Error("Unsupported file format");
  } catch (err) {
    console.error("TEXT EXTRACTION ERROR:", err);
    throw new Error("Failed to extract text from file");
  }
};

const autoAssignGrade = (percentage) => {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const parseMarksheetProperly = (text) => {
  const subjectRegex = /^[A-Z]{2,4}\s*\d+-[A-Za-z0-9\s&()]+/gm;
  const subjectsUnique = [...new Set(text.match(subjectRegex) || [])];

  const totalRegex = /(\d+\.\d+\/100\.00)\s*0*\s*([A-F])/g;
  const totals = [];

  let match;

  while ((match = totalRegex.exec(text)) !== null) {
    totals.push({
      marks: match[1],
      grade: match[2],
    });
  }

  const finalSubjects = subjectsUnique
    .map((name, idx) => {
      const t = totals[idx];
      if (!t) return null;

      const [obtained, max] = t.marks.split("/");

      return {
        name: name.trim(),
        marks: Number(obtained),
        maxMarks: Number(max),
        grade: t.grade,
      };
    })
    .filter(Boolean);

  return {
    semester:
      text.match(/Registration Pattern\s*:\s*(Semester\s*[IVX]+)/i)?.[1] || "",
    year: text.match(/Session\s*:\s*(\d{4}-\d{4})/)?.[1] || "",
    cgpa: text.match(/CGPA\s*:\s*(\d+\.\d+)/)?.[1] || "",
    subjects: finalSubjects,
  };
};

//upload marksheet
export const uploadMarksheetController = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    const buffer = req.file.buffer;

    const rawText = await extractTextFromFile(buffer, req.file.mimetype);

    const parsed = parseMarksheetProperly(rawText);

    if (!parsed.subjects.length)
      return res.status(400).json({
        success: false,
        message: "Could not extract subject data",
      });

    const subjects = parsed.subjects.map((sub) => {
      const pct = (sub.marks / sub.maxMarks) * 100;

      return {
        name: sub.name,
        marks: sub.marks,
        maxMarks: sub.maxMarks,
        grade: sub.grade || autoAssignGrade(pct),
      };
    });

    console.log("Formatted Subjects:", subjects);

    const totalMarks = subjects.reduce((s, x) => s + x.marks, 0);
    const totalMax = subjects.reduce((s, x) => s + x.maxMarks, 0);

    const percentage = totalMax
      ? ((totalMarks / totalMax) * 100).toFixed(2)
      : "0";

    console.log("Total Percentage:", percentage);

    const sem = parsed.semester || req.body.semester;

    const existing = await Marksheet.findOne({
      studentId: req.user._id,
      semester: sem,
    });

    if (existing) {
      console.log("Duplicate semester upload prevented");
      return res.status(400).json({
        success: false,
        message: `Marksheet for ${sem} already exists`,
      });
    }

    const saved = await Marksheet.create({
      studentId: req.user._id,
      semester: sem,
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

    console.log("Marksheet saved to DB:", saved._id);

    const allMarksheets = await Marksheet.find({
      studentId: req.user._id,
    }).sort({ semester: 1 });

    console.log("Total marksheets for student:", allMarksheets.length);

    const semesterTrend = allMarksheets.map((m) => ({
      semester: m.semester,
      percentage: Number(m.percentage),
    }));

    console.log("Semester Trend:", semesterTrend);

    const overallPerformance =
      allMarksheets.reduce((a, m) => a + Number(m.percentage), 0) /
      allMarksheets.length;

    console.log("Overall Performance:", overallPerformance);

    const subjectStats = {};

    allMarksheets.forEach((m) => {
      m.subjects.forEach((sub) => {
        if (!subjectStats[sub.name])
          subjectStats[sub.name] = { totalMarks: 0, totalMax: 0 };

        subjectStats[sub.name].totalMarks += sub.marks;
        subjectStats[sub.name].totalMax += sub.maxMarks;
      });
    });

    const subjectWisePerformance = Object.keys(subjectStats).map((name) => {
      const s = subjectStats[name];
      const avg = (s.totalMarks / s.totalMax) * 100;

      return { name, average: avg };
    });

    const globalWeakSubjects = detectWeakSubjects(subjectWisePerformance);

    const predictedDomain = predictAcademicDomain(subjectWisePerformance);

    const trendStatus = analyzeTrend(semesterTrend);

    const roadmapRaw = generateImprovementRoadmap(globalWeakSubjects);

    const roadmap = roadmapRaw.map((item) => {
      if (typeof item === "string") return item;

      if (item?.subject && item?.recommendation)
        return `${item.subject}: ${item.recommendation}`;

      if (item?.recommendation) return item.recommendation;

      return JSON.stringify(item);
    });

let improvementTrend = 0;

if (semesterTrend.length >= 2) {
  const last = semesterTrend[semesterTrend.length - 1].percentage;
  const prev = semesterTrend[semesterTrend.length - 2].percentage;
  improvementTrend = last - prev;
}

const weakSubjectCount = globalWeakSubjects.length;

const studyHours = Math.min(10, Math.max(2, Math.round(overallPerformance / 10)));

const motivation = improvementTrend > 0 ? 8 : improvementTrend < 0 ? 4 : 6;

const stressLevel = weakSubjectCount >= 3 ? 8 : weakSubjectCount === 2 ? 6 : 3;

const assignmentCompletion = Math.max(
  40,
  Math.min(100, overallPerformance - weakSubjectCount * 5)
);

const mlFeatures = {
  StudyHours: studyHours,
  Attendance: overallPerformance,
  AssignmentCompletion: assignmentCompletion,
  Motivation: motivation,
  StressLevel: stressLevel,
};

    const mlInsights = await getMLPredictions(mlFeatures);

    const nextSemesterPrediction =
      mlInsights?.data?.nextSemesterPrediction || 0;

    const placementProbability =
      mlInsights?.data?.placementProbability || 0;

    const riskScore =
      mlInsights?.data?.riskScore || 0;

    const careerReadiness = Math.min(
      100,
      Math.round((overallPerformance + nextSemesterPrediction) / 2)
    );

    await Marksheet.updateMany(
      { studentId: req.user._id },
      { $unset: { mlInsights: "" } }
    );

    await Marksheet.findByIdAndUpdate(saved._id, {
      mlInsights: {
        predictedStrongDomain: predictedDomain,
        weakSubjects: globalWeakSubjects,
        academicTrend: trendStatus,
        academicRiskScore: riskScore,
        careerReadinessScore: careerReadiness,
        nextSemesterPrediction,
        improvementRoadmap: roadmap,
        placementProbability,
      },
    });

    res.json({
      success: true,
      data: saved,
      mlInsights: {
        predictedStrongDomain: predictedDomain,
        weakSubjects: globalWeakSubjects,
        academicTrend: trendStatus,
        academicRiskScore: riskScore,
        careerReadinessScore: careerReadiness,
        nextSemesterPrediction,
        improvementRoadmap: roadmap,
        placementProbability,
      },
    });

  } catch (err) {

    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};

// get all marksheets
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

//delete marksheet
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

// get academic dahboard
export const getAcademicDashboard = async (req, res) => {
  try {
    const marksheets = await Marksheet.find({
      studentId: req.user._id,
    }).sort({ semester: 1 });

    if (!marksheets.length)
      return res.json({
        success: true,
        data: {
          overallPerformance: null,
          subjectWisePerformance: [],
          semesterTrend: [],
        },
      });

    const subjectStats = {};

    marksheets.forEach((m) => {
      m.subjects.forEach((s) => {
        if (!subjectStats[s.name])
          subjectStats[s.name] = { total: 0, count: 0 };

        subjectStats[s.name].total += (s.marks / s.maxMarks) * 100;
        subjectStats[s.name].count++;
      });
    });

    const subjectWisePerformance = Object.keys(subjectStats).map((name) => ({
      name,
      average: (
        subjectStats[name].total /
        subjectStats[name].count
      ).toFixed(2),
    }));

    const overallPerformance = (
      marksheets.reduce((a, m) => a + Number(m.percentage), 0) /
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
    res.status(500).json({
      success: false,
      message: "Dashboard error",
    });
  }
};