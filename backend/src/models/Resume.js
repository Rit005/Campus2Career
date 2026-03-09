import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  summary: String,
  technologies: [String],
});

const recommendedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  title: String,
  company: String,
  matchScore: Number,
  matchingSkills: [String],
  missingSkills: [String]
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

    projects: [projectSchema],            
    missing_skills: [String],              
    project_recommendations: [String],  


     predictedDomain: String,
    domainConfidence: Number,
    resumeStrengthScore: Number,
    aiScore: Number,
    recommendedJobs:[recommendedJobSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
