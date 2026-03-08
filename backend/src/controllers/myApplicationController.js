import Application from "../models/Application.js";

// get student application
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user._id;

    const applications = await Application.find({ studentId })
  .populate({
    path: "jobId",
    select: "jobTitle company jobLocation salary requiredSkills"
  })
  .sort({ createdAt: -1 });

    return res.json({ success: true, data: applications });
  } catch (err) {
    console.error("FETCH APPLICATIONS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
};

// delete application
export const deleteApplication = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { id } = req.params;

    const app = await Application.findOne({ _id: id, studentId });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found or unauthorized",
      });
    }

    await Application.deleteOne({ _id: id });

    return res.json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    console.error("DELETE APPLICATION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};