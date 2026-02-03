import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: String,
    company: String,
    jobLocation: String,
    salary: String,
    jobDescription: String,
    requiredSkills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
