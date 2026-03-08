import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobLocation: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
    },

    jobDescription: {
      type: String,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    experienceLevel: {
      type: String,
      enum: ["Intern", "Fresher", "Junior", "Mid", "Senior"],
      default: "Fresher",
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time", "Contract"],
      default: "Full-time",
    },

    domain: {
      type: String, 
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);