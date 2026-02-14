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

    return res.json({ success: true, students: formatted });

  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    return res.status(500).json({
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
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("USER:", req.user);
    const { jobId, jobRole, message, expectedSalary } = req.body;

    // 🔹 Validate required fields
    if (!jobId || !jobRole) {
      return res.status(400).json({
        success: false,
        message: "Job ID and Job Role are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // 🔹 Prevent duplicate application
    const existing = await Application.findOne({
      jobId,
      studentId: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 🔹 Get user details from logged-in user
    const name = req.user.name;
    const email = req.user.email;
    const phone = req.user.phone || "Not Provided";

    // 🔹 Create application
    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      jobRole,
      message,
      name,
      email,
      phone,
      expectedSalary,

      // 🔥 STORE FILE IN DATABASE
      resumeData: req.file.buffer,
      resumeName: req.file.originalname,
      resumeType: req.file.mimetype,
      resumeSize: req.file.size,

      status: "applied",
    });

    return res.json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Application failed",
    });
  }
};
export const downloadResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.set({
      "Content-Type": application.resumeType,
      "Content-Disposition": `attachment; filename="${application.resumeName}"`,
    });

    res.send(application.resumeData);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
};
