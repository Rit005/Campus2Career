import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: String }, 
    currentSemester: { type: String },
    currentCGPA: { type: Number },
    totalCreditsCompleted: { type: Number },
    attendancePercentage: { type: Number },

    skills: {
      type: [String],
      default: [],
    },

    areasOfInterest: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
