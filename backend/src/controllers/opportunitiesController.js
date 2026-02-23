import Resume from "../models/Resume.js";
import Job from "../models/Job.js";

export const getStudentOpportunities = async (req, res) => {
  try {
    const studentId = req.user._id;

    const resume = await Resume.findOne({ studentId });
    if (!resume) {
      return res.json({ success: true, jobs: [] });
    }

    const userSkills = resume.skills || [];
    const roles = resume.suitable_roles || [];

    const jobs = await Job.find({
      $or: [
        { skillsRequired: { $in: userSkills } },
        { title: { $in: roles } }
      ]
    }).limit(10);

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to load opportunities" });
  }
};
