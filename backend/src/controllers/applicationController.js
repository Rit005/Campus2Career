import Application from "../models/Application.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";

export const getApplicantsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId });

    res.json({
      success: true,
      applicants: applications,
    });

  } catch (err) {
    console.error("FETCH APPLICANTS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch applicants" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;  

    if (!["selected", "rejected", "shortlisted"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Status updated",
      data: updated,
    });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const updateRecruiterNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const app = await Application.findByIdAndUpdate(
      id,
      { recruiterNotes: note },
      { new: true }
    );

    res.json({ success: true, data: app });
  } catch (err) {
    console.error("RECRUITER NOTE ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to update note" });
  }
};

export const getResumeByApplicationId = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application || !application.resumePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const filePath = path.resolve(application.resumePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File does not exist",
      });
    }

    res.setHeader("Content-Type", "application/pdf"); 
    res.sendFile(filePath);

  } catch (error) {
    console.error("RESUME FETCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};