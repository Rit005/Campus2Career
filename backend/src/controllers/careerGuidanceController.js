
import Job from "../models/Job.js";
import CareerProfile from "../models/CareerProfile.js";
import AcademicSummary from "../models/AcademicSummary.js";
import Marksheet from "../models/Marksheet.js";
import Resume from "../models/Resume.js";
import { groq } from "../groqClient.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const analyzeCareer = async (req, res) => {
  try {
    const studentId = req.user._id;

    const [marksheets, resume, academicSummary] = await Promise.all([
      Marksheet.find({ studentId }).sort({ semester: 1 }),
      Resume.findOne({ studentId }),
      AcademicSummary.findOne({ studentId }),
    ]);

    if (!marksheets.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 1 marksheet!",
      });
    }

    const consolidatedSubjects = [];

    marksheets.forEach((sheet) => {
      sheet.subjects.forEach((s) => {
        consolidatedSubjects.push({
          name: s.name,
          percentage: (s.marks / s.maxMarks) * 100,
          grade: s.grade,
          semester: sheet.semester,
        });
      });
    });

    const strongSubjects = academicSummary?.strengths || [];
    const weakSubjects = academicSummary?.weaknesses || [];
    const resumeSkills = resume?.skills || [];
    const resumeProjects = resume?.projects || [];
    const tenthScore = academicSummary?.tenthPercentage || null;
    const twelfthScore = academicSummary?.twelfthPercentage || null;
    const overallAvg = academicSummary?.overallAverage || 0;

   const prompt = `
You are an AI Career Counselor and ML-based recommendation engine.

You must compute match scores using THIS FORMULA:

1. Academic Strength Score (0-40)
   - Strong subjects = +10 each
   - Subjects with >80% = +8
   - Subjects with 70–80% = +5
   - Subjects with <60% = -5

2. Resume Skill Match (0-40)
   Compare student's resume skills with REQUIRED skills for each field:
   - Software Engineering required: Java, Python, DSA, OOP, Git, SQL
   - Web Development required: HTML, CSS, JS, React, Node, MongoDB
   - Data Science required: Python, Statistics, ML, Pandas, NumPy
   - AI/ML required: Python, ML, DL, Neural Networks, TensorFlow
   - Cyber Security required: Networking, Linux, Security Tools, Python

   Score:
   - +5 per matching skill
   - +2 per related project

3. Project Relevance Score (0-20)
   Based on resume projects:
   - Highly relevant project = +10
   - Medium = +5
   - Basic = +2

Final Match Score = A + S + P  
(Clamp between 0-100)

You must use real scoring — NOT guess.

Now analyze the student using:  
Subjects: ${JSON.stringify(consolidatedSubjects, null, 2)}  
Resume Skills: ${resumeSkills.join(", ")}  
Projects: ${JSON.stringify(resumeProjects, null, 2)}  
Marks (10th/12th): ${tenthScore}%, ${twelfthScore}%  
Overall Average: ${overallAvg}%

Return strict JSON ONLY in format:

{
  "careerDomains": [{"name":"", "matchScore":0, "description":""}],
  "recommendedRoles": [{"title":"", "domain":"", "matchScore":0, "description":""}],
  "higherStudies": {
      "india": [{"program":"", "colleges":[""]}],
      "abroad": [{"program":"", "universities":[""], "countries":[""]}]
  },
  "recommendedColleges": [{"name":"", "reason":""}],
  "skillGaps": [{"skill":"", "importance":"high", "resources":[""]}],
  "recommendedCertifications": [{"name":"", "provider":"", "url":"", "priority":""}],
  "suggestedProjects": [{"title":"", "description":"", "difficulty":"", "technologies":[""], "outcome":""}],
  "learningRoadmap": [{"phase":"", "duration":"", "goals":[""], "resources":[""]}]
}

RESPOND WITH JSON ONLY.
`;


    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    let raw = response.choices[0].message.content;
    raw = raw.substring(raw.indexOf("{"));
    raw = raw.substring(0, raw.lastIndexOf("}") + 1);

    const careerData = JSON.parse(raw);

    await CareerProfile.findOneAndUpdate(
      { studentId },
      { ...careerData, lastAnalyzed: new Date(), updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: careerData });

  } catch (error) {
    console.error("Career analysis error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCareerProfile = async (req, res) => {
  try {
    const profile = await CareerProfile.findOne({ studentId: req.user._id });

    return res.json({
      success: true,
      data: profile || null,
    });
  } catch (error) {
    console.error("Career profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career profile",
    });
  }
};
