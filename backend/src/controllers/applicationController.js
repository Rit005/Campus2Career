import Application from "../models/Application.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

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