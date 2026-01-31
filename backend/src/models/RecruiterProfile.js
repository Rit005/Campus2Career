import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    companyName: { type: String, required: true },
    designation: { type: String },  // HR Manager, Talent Lead, etc.
    department: { type: String },
    companyWebsite: { type: String },

    // AI dashboards
    hiringPipeline: [
      {
        stage: String,         // Applied / Shortlisted / Interview / Selected
        count: Number,
      }
    ],

    jobPosts: [
      {
        title: String,
        description: String,
        skillsRequired: [String],
        salaryRange: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    matchedCandidates: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" },
        matchScore: Number,
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);
