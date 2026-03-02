import Application from "../models/Application.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

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


export const applyForJob = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    const {
      jobId,
      jobRole,
      message,
      expectedSalary,
      name,
      email,
      phone
    } = req.body;

    if (!jobId || !jobRole || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

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

    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      jobRole,
      message,
      name,
      email,
      phone,
      expectedSalary,

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
