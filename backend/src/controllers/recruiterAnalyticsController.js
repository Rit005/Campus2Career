import Student from "../models/Student.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getRecruiterAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const skillDistribution = await Resume.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 25 }
    ]);


    const jobSkillDemand = await Job.aggregate([
      { $unwind: "$requiredSkills" }, 
      {
        $group: {
          _id: "$requiredSkills",
          jobCount: { $sum: 1 }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 20 }
    ]);

    const jobPostingTrend = await Job.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] },
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
