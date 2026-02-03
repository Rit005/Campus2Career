import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    fileName: String,
    fileType: String,
    fileSize: Number,

    extractedText: String,

    skills: [String],
    experience_summary: String,
    education: String,
    suitable_roles: [String],

    aiScore: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);