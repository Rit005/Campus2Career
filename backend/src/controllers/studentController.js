import Application from "../models/Application.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

/* ============================================================
   GET ALL STUDENTS (Recruiter View)
============================================================ */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId", "name email");

    const formatted = students.map((s) => ({
      _id: s._id,
      name: s.userId?.name,
      email: s.userId?.email,
      branch: s.branch,
      skills: s.skills,
    }));

    res.json({ success: true, students: formatted });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load students",
    });
  }
};

/* ============================================================
   APPLY FOR JOB (Student)
============================================================ */
export const applyForJob = async (req, res) => {
  try {
    const { jobId, jobRole, message, expectedSalary } = req.body;

    // these 3 fields are NOT coming from req.body 
    // so remove them
    const name = req.body.name || req.user.name;
    const email = req.body.email || req.user.email;
    const phone = req.body.phone || req.user.phone || "Not Provided";

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      jobRole,
      message,
      name,
      email,
      phone,
      expectedSalary,
      resume: req.file.path,
      status: "applied",
    });

    return res.json({ success: true, data: application });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
