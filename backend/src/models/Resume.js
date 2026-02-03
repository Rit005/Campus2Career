import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  summary: String,
  technologies: [String],
});

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

    // ⭐ NEW FIELDS
    projects: [projectSchema],             // <-- This fixes project extraction
    missing_skills: [String],              // <-- Needed for displaying missing skills
    project_recommendations: [String],     // <-- AI recommendations

    aiScore: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
