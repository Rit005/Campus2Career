import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  maxMarks: Number,
  grade: String,
  credits: {type:Number},
});

const marksheetSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  semester: { type: String, required: true },
  year: { type: String },

  // 🔥 MUST EXIST for your logic to work
  cgpa: { type: String, default: "" },
  percentage: { type: String, default: "" },

  subjects: [subjectSchema],

  filePath: String,
  fileName: String,
  fileType: String,
  fileSize: Number,

  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Marksheet", marksheetSchema);
