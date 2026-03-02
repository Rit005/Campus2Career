import StudentProfile from "../models/StudentProfile.js";

export const saveStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const payload = {
      fullName: req.body.fullName || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      dateOfBirth: req.body.dateOfBirth || "",
      currentSemester: req.body.currentSemester || "",
      currentCGPA: req.body.currentCGPA || "",
      totalCreditsCompleted: req.body.totalCreditsCompleted || "",
      attendancePercentage: req.body.attendancePercentage || 0,
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      areasOfInterest: Array.isArray(req.body.areasOfInterest)
        ? req.body.areasOfInterest
        : [],
    };

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: payload },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error("PROFILE SAVE ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save profile" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    return res.json({
      success: true,
      data: profile || null,
    });
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || typeof skill !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Skill is required" });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { skills: skill } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: profile.skills });
  } catch (err) {
    console.error("ADD SKILL ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add skill" });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { skills: skill } },
      { new: true }
    );

    return res.json({ success: true, data: profile.skills });
  } catch (err) {
    console.error("REMOVE SKILL ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove skill" });
  }
};

export const addInterest = async (req, res) => {
  try {
    const { interest } = req.body;

    if (!interest || typeof interest !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Interest is required" });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { areasOfInterest: interest } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: profile.areasOfInterest });
  } catch (err) {
    console.error("ADD INTEREST ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add interest" });
  }
};

export const removeInterest = async (req, res) => {
  try {
    const { interest } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { areasOfInterest: interest } },
      { new: true }
    );

    return res.json({ success: true, data: profile.areasOfInterest });
  } catch (err) {
    console.error("REMOVE INTEREST ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to remove interest" });
  }
};