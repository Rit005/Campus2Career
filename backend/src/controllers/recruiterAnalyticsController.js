import Student from "../models/Student.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getRecruiterAnalytics = async (req, res) => {
  try {
    // ---------------------------
    // 1. TOTAL STUDENTS
    // ---------------------------
    const totalStudents = await Student.countDocuments();

    // ---------------------------
    // 2. STUDENT SKILL DISTRIBUTION
    // ---------------------------
    const skillDistribution = await Resume.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 25 }
    ]);

    // ---------------------------
    // 3. JOB SKILL DEMAND (FIXED)
    // ---------------------------
    const jobSkillDemand = await Job.aggregate([
      { $unwind: "$requiredSkills" }, // <-- CORRECT FIELD
      {
        $group: {
          _id: "$requiredSkills",
          jobCount: { $sum: 1 }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 20 }
    ]);


    // ---------------------------
    // 6. MONTHLY JOB POSTING TREND
    // ---------------------------
    const jobPostingTrend = await Job.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] }, // YYYY-MM
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json({
      success: true,
      data: {
        totalStudents,
        skillDistribution,
        jobSkillDemand,
        jobPostingTrend
      }
    });

  } catch (err) {
    console.error("Recruiter Analytics Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
