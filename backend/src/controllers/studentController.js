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

    res.json({ success: true, students: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load students" });
  }
};
