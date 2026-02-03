
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  marks: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true, min: 1 },
  grade: { type: String, trim: true }
}, { _id: false });

const marksheetSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  semester: { type: String, required: true, trim: true },
  subjects: { type: [subjectSchema], required: true, validate: [arr => arr.length > 0, 'At least one subject required'] },
  attendance: { type: Number, min: 0, max: 100, default: null },
  overallPercentage: { type: Number, required: true, min: 0, max: 100 },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

marksheetSchema.index({ studentId: 1, semester: 1 }, { unique: true });
marksheetSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model('Marksheet', marksheetSchema);
