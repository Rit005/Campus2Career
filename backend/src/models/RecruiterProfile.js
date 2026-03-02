import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, required: true },

    designation: { type: String },
    department: { type: String },
    companyWebsite: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);