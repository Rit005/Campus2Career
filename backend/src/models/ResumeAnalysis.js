
import mongoose from 'mongoose';

/**
 * ResumeAnalysis Schema
 * Stores resume metadata and AI analysis results
 */
const resumeAnalysisSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  
  // File information
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  
  // Extracted content
  extractedText: {
    type: String,
    default: '',
  },
  
  // Analysis results
  extractedSkills: [{
    type: String,
    trim: true,
  }],
  aiSummary: {
    type: String,
    default: '',
  },
  suggestedRoles: [{
    type: String,
    trim: true,
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for efficient queries
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted date
resumeAnalysisSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
