import mongoose from 'mongoose';

const careerProfileSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  careerDomains: [{
    name: String,
    matchScore: Number,
    description: String
  }],
  recommendedRoles: [{
    title: String,
    domain: String,
    matchScore: Number,
    description: String
  }],
  skillGaps: [{
    skill: String,
    importance: { type: String, enum: ['high', 'medium', 'low'] },
    resources: [String]
  }],
  recommendedCertifications: [{
    name: String,
    provider: String,
    url: String,
    priority: { type: String, enum: ['essential', 'recommended', 'optional'] }
  }],
  suggestedProjects: [{
    title: String,
    description: String,
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    technologies: [String],
    outcome: String
  }],
  learningRoadmap: [{
    phase: String,
    duration: String,
    goals: [String],
    resources: [String]
  }],
  lastAnalyzed: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('CareerProfile', careerProfileSchema);

