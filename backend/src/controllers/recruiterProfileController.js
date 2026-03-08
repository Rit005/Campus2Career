import RecruiterProfile from "../models/RecruiterProfile.js";

// save recruiter profile
export const saveRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const payload = {
      fullName: req.body.fullName || "",
      email: req.body.email || "",
      organization: req.body.organization || "",
      designation: req.body.designation || "",
      department: req.body.department || "",
      companyWebsite: req.body.companyWebsite || "",
    };

    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId },
      { $set: payload },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error("RECRUITER PROFILE SAVE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save recruiter profile",
    });
  }
};

// get recruiter profile
export const getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });

    return res.json({
      success: true,
      data: profile || null,
    });
  } catch (err) {
    console.error("RECRUITER PROFILE FETCH ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter profile",
    });
  }
};