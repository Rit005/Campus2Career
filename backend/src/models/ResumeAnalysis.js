import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  summary: String,
  technologies: [String],
});

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileData: {
      type: Buffer,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },

    extractedText: String,

    skills: [String],
    experience_summary: String,
    education: String,
    suitable_roles: [String],

    projects: [projectSchema],

    missing_skills: [String],
    project_recommendations: [String],

    aiScore: Number,
  },
  { timestamps: true }
);

resumeSchema.index({ studentId: 1, updatedAt: -1 });

export default mongoose.model("Resume", resumeSchema);
