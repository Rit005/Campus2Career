import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  maxMarks: Number,
  grade: String,
  credits: Number,
});

const marksheetSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    semester: { type: String, required: true },
    year: { type: String },

    // Academic fields
    cgpa: { type: String, default: "" },
    percentage: { type: String, default: "" },

    subjects: [subjectSchema],

    // ---------------------
    // STORE FILE IN DATABASE
    // ---------------------
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },

    fileData: {
      type: Buffer,   // ⬅️ MAIN FIX — file stored inside MongoDB
      required: true,
    },

    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Fast lookups
marksheetSchema.index({ studentId: 1, uploadedAt: -1 });

export default mongoose.model("Marksheet", marksheetSchema);
