import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fileName: String,
    fileType: String,
    fileSize: Number,

    extractedText: String,

    skills: [String],

    experience_summary: String,

    education: [
      {
        institution: String,
        degree: String,
        cgpa: Number,
        score: Number,
        duration: String,
      },
    ],

    suitable_roles: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
