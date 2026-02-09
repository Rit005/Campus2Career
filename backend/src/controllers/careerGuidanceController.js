
import Job from "../models/Job.js";
import CareerProfile from "../models/CareerProfile.js";
import AcademicSummary from "../models/AcademicSummary.js";
import Marksheet from "../models/Marksheet.js";
import Resume from "../models/Resume.js";
import { groq } from "../groqClient.js";

/* ============================================================
   GET ALL JOBS (STUDENT + RECRUITER USE)
============================================================ */
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

/* ============================================================
   ANALYZE CAREER
============================================================ */
export const analyzeCareer = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch all academic sources
    const [marksheets, resume, academicSummary] = await Promise.all([
      Marksheet.find({ studentId }).sort({ createdAt: -1 }),
      Resume.findOne({ studentId }),
      AcademicSummary.findOne({ studentId }),
    ]);

    if (!marksheets.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 1 marksheet!",
      });
    }

    const strongSubjects = academicSummary?.strengths || [];
    const resumeSkills = resume?.skills || [];
    const overallAvg = academicSummary?.overallAverage || 0;

    const prompt = `
Analyze based on:
- Strong subjects: ${strongSubjects.join(", ")}
- Resume skills: ${resumeSkills.join(", ")}
- Overall academic avg: ${overallAvg}%

Return ONLY clean JSON:
{
  "careerDomains": [{"name":"", "matchScore":0, "description":""}],
  "recommendedRoles": [{"title":"", "domain":"", "matchScore":0, "description":""}],
  "skillGaps": [{"skill":"", "importance":"high", "resources":[""]}],
  "recommendedCertifications": [{"name":"", "provider":"", "url":"", "priority":""}],
  "suggestedProjects": [{"title":"", "description":"", "difficulty":"", "technologies":[""], "outcome":""}],
  "learningRoadmap": [{"phase":"", "duration":"", "goals":[""], "resources":[""]}]
}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const match = response.choices[0]?.message?.content?.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("AI response did not contain valid JSON");

    const careerData = JSON.parse(match[0]);

    // Save to DB
    await CareerProfile.findOneAndUpdate(
      { studentId },
      { ...careerData, lastAnalyzed: new Date(), updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: careerData });
  } catch (error) {
    console.error("Career analysis error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   GET CAREER PROFILE (Student)
============================================================ */
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
