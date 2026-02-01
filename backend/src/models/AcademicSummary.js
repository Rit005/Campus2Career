import mongoose from 'mongoose';

const academicSummarySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  strengths: [{ type: String, trim: true }],
  weaknesses: [{ type: String, trim: true }],
  semesterTrend: [{
    semester: String,
    percentage: Number,
    trend: { type: String, enum: ['up', 'down', 'stable'] }
  }],
  consistencyScore: { type: Number, min: 0, max: 100, default: 0 },
  overallAverage: { type: Number, min: 0, max: 100, default: 0 },
  totalSemesters: { type: Number, default: 0 },
  subjectWisePerformance: [{
    subject: String,
    average: Number,
    trend: String
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AcademicSummary', academicSummarySchema);

