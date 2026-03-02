import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: { type: String, required: true },
    message: { type: String },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    expectedSalary: { type: String },

    // Resume metadata (safe to store in DB)
    resumeData: { type: Buffer, required: true },
    resumeName: { type: String, required: true },
    resumeType: { type: String, required: true },
    resumeSize: { type: Number, required: true },

    status: {
      type: String,
      enum: ["applied", "under review", "shortlisted", "rejected", "selected"],
      default: "applied",
    },

    recruiterNotes: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);